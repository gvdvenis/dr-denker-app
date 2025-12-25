## Plan: Centralized Sync + Auth

Introduce ASP.NET minimal API for auth/sync while keeping offline-first: email OTP + passkey, stored answers synced on login, likelihood scoring, Vue client reworked to use the API with background sync and conflict handling.

### Steps
1. Define repo layout choice (mono vs dual): APIs, shared contracts, deployment flow.
2. Design auth model: email OTP issuance, passkey (WebAuthn or encrypted refresh token) storage, session lifecycle.
3. Sketch API surface: `/auth/request-otp`, `/auth/verify`, `/me`, `/answers` CRUD, `/stats/answer-likelihood`; data contracts for `User`, `Answer`, `Likelihood`.
4. Update client data flow: replace `useLocalStorage` with hybrid store (local cache + remote sync), add login/logout UI, session bootstrap from stored creds, background sync when online.
5. Add scoring UI: color answers based on likelihood thresholds and uncertainty; integrate into ImageZoomView/CrosswordView displays.
6. Plan offline/merge rules: queue mutations offline, reconcile on reconnect (last-write vs server-trust), handle multi-device by userId + timestamps.

### Repo Setup Options (pros/cons)
1. Single repo, single solution (Vue + API in one root, e.g., `/api`, `/web`, one `.sln`):
   - Pros: unified issues/CI/CD, easy shared contracts, simpler local dev/bootstrap.
   - Cons: heavier checkout, intertwined release cadence, permission granularity limited.
2. Single repo, multi-solution (shared root, separate `.sln` for API, existing JS toolchain for web):
   - Pros: separation of concerns while keeping single source of truth and PR flow.
   - Cons: still coupled CI; JS/TS and .NET tooling coexist, slightly more setup.
3. Dual repos (`dr-denker-app`, `dr-denker-api`) with a shared contracts package (npm/nuget):
   - Pros: independent versioning/deploy, cleaner ownership/permissions, lighter checkouts.
   - Cons: coordination overhead, contract drift risk, extra package publishing pipeline.

### Further Considerations
1. Auth storage: Prefer WebAuthn passkey; fallback to short-lived refresh token encrypted via Web Crypto + IndexedDB; avoid plain localStorage.
2. Likelihood thresholds: e.g., ≥80% green, 50–79% amber, <50% red; cap uncertainty for low sample sizes.
3. Sync strategy: mutation queue with retry/backoff; conflict resolution rule (server-wins vs latest timestamp) to be chosen.
