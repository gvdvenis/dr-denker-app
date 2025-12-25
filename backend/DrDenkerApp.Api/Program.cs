using System.Collections.Concurrent;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// Allow local dev client (Vite default: http://localhost:5173)
builder.Services.AddCors(options =>
{
	options.AddDefaultPolicy(policy =>
		policy.WithOrigins("http://localhost:5173")
			  .AllowAnyHeader()
			  .AllowAnyMethod()
			  .AllowCredentials());
});

builder.Services.ConfigureHttpJsonOptions(options =>
{
	options.SerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
});

var app = builder.Build();

app.UseCors();

// In-memory stores (replace with DB later)
var otpStore = new ConcurrentDictionary<string, (string Code, DateTime Expiry)>(); // key: email
var users = new ConcurrentDictionary<string, User>(); // key: userId
var emailToUserId = new ConcurrentDictionary<string, string>(); // key: email -> userId
var sessions = new ConcurrentDictionary<string, string>(); // key: token -> userId
var answers = new ConcurrentDictionary<string, Dictionary<int, AnswerDto>>(); // key: userId -> (imageId -> answer)

app.MapGet("/", () => new { status = "ok", service = "DrDenker.Api" });

// Auth: request OTP
app.MapPost("/auth/request-otp", (RequestOtpDto dto) =>
{
	if (string.IsNullOrWhiteSpace(dto.Email)) return Results.BadRequest(new { error = "Email required" });
	var code = GenerateOtp();
	otpStore[dto.Email] = (code, DateTime.UtcNow.AddMinutes(10));
	// TODO: send email; for dev, log to console
	Console.WriteLine($"[OTP] {dto.Email} -> {code}");
	return Results.Ok(new { success = true });
});

// Auth: verify OTP -> issue session token
app.MapPost("/auth/verify", (VerifyOtpDto dto) =>
{
	if (!otpStore.TryGetValue(dto.Email, out var entry)) return Results.BadRequest(new { error = "Invalid or expired code" });
	if (entry.Expiry < DateTime.UtcNow || entry.Code != dto.Code) return Results.BadRequest(new { error = "Invalid or expired code" });

	// ensure user
	var userId = emailToUserId.GetOrAdd(dto.Email, _ => Guid.NewGuid().ToString("N"));
	var user = users.GetOrAdd(userId, _ => new User(userId, dto.Email));

	// issue opaque token (GUID) and store session
	var token = Guid.NewGuid().ToString("N");
	sessions[token] = userId;

	// clear OTP after successful verification
	otpStore.TryRemove(dto.Email, out _);

	return Results.Ok(new { token, user });
});

// Me
app.MapGet("/me", (HttpContext http) =>
{
	var uid = GetUserId(http, sessions);
	if (uid is null) return Results.Unauthorized();
	var user = users.TryGetValue(uid, out var u) ? u : null;
	return user is null ? Results.NotFound() : Results.Ok(user);
});

// Answers: list
app.MapGet("/answers", (HttpContext http) =>
{
	var uid = GetUserId(http, sessions);
	if (uid is null) return Results.Unauthorized();

	var dict = answers.TryGetValue(uid, out var d) ? d : new Dictionary<int, AnswerDto>();
	return Results.Ok(dict.Values.OrderBy(a => a.ImageId));
});

// Answers: upsert
app.MapPost("/answers", (HttpContext http, AnswerDto dto) =>
{
	var uid = GetUserId(http, sessions);
	if (uid is null) return Results.Unauthorized();
	if (dto.ImageId < 1 || dto.ImageId > 40) return Results.BadRequest(new { error = "imageId out of range" });
	if (string.IsNullOrWhiteSpace(dto.Answer)) return Results.BadRequest(new { error = "answer required" });

	var dict = answers.GetOrAdd(uid, _ => new Dictionary<int, AnswerDto>());
	dict[dto.ImageId] = dto with { Answer = dto.Answer.Trim().ToUpperInvariant(), Timestamp = dto.Timestamp > 0 ? dto.Timestamp : DateTimeOffset.UtcNow.ToUnixTimeSeconds() };
	return Results.Ok(dict[dto.ImageId]);
});

// Likelihood stats (stub): returns simple likelihood based on whether user provided an answer
app.MapGet("/stats/answer-likelihood", (HttpContext http) =>
{
	var uid = GetUserId(http, sessions);
	if (uid is null) return Results.Unauthorized();
	var dict = answers.TryGetValue(uid, out var d) ? d : new Dictionary<int, AnswerDto>();
	var list = Enumerable.Range(1, 40).Select(i =>
	{
		var has = dict.ContainsKey(i);
		var likelihood = has ? 85 : 50; // basic thresholds
		var uncertainty = has ? 10 : 30;
		return new LikelihoodDto(i, likelihood, uncertainty);
	});
	return Results.Ok(list);
});

app.Run();

static string? GetUserId(HttpContext http, ConcurrentDictionary<string, string> sessions)
{
	var auth = http.Request.Headers.Authorization.ToString();
	if (string.IsNullOrWhiteSpace(auth) || !auth.StartsWith("Bearer ")) return null;
	var token = auth["Bearer ".Length..];
	return sessions.TryGetValue(token, out var uid) ? uid : null;
}

static string GenerateOtp()
{
	var rnd = Random.Shared.Next(0, 999999);
	return rnd.ToString("D6");
}

// Contracts
public record RequestOtpDto(string Email);
public record VerifyOtpDto(string Email, string Code);
public record User(string Id, string Email);
public record AnswerDto(int ImageId, string Answer, long Timestamp);
public record LikelihoodDto(int ImageId, int Likelihood, int Uncertainty);
