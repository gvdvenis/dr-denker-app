# Dr. Denker App

Interactive image puzzle application with centralized auth and answer syncing.

## Project Structure

```
dr-denker-app/
├── doc/                    # Documentation and design notes
├── frontend/               # Vue 3 SPA with PWA support
│   ├── src/               # Vue components and composables
│   ├── public/            # Static assets
│   └── package.json       # Frontend dependencies
├── backend/                # ASP.NET Core minimal API
│   └── DrDenkerApp.Api/   # Auth and sync endpoints
└── DrDenkerApp.sln        # Root solution file
```

## Getting Started

### Prerequisites

- **Node.js** 18+ and npm (for frontend)
- **.NET 10.0** SDK (for backend)

### Running Locally

#### Option 1: Using VS Code Tasks

Open `DrDenkerApp.code-workspace` in VS Code and use:
- **Run Backend** task to start the API
- **Run Frontend** task to start the Vue dev server

#### Option 2: Manual Commands

**Backend API:**
```powershell
dotnet run --project .\backend\DrDenkerApp.Api\DrDenkerApp.Api.csproj --urls "http://localhost:5000"
```

**Frontend:**
```powershell
cd .\frontend
npm install    # First time only
npm run dev
```

The Vue app will be available at `http://localhost:5173` and will proxy API requests to the backend.

## Features

- **Offline-first**: Local storage with background sync
- **Email OTP Auth**: Secure login with one-time codes
- **Answer Sync**: Multi-device answer synchronization
- **Likelihood Scoring**: Visual indicators for answer confidence
- **PWA Support**: Installable with offline capabilities

## Development

### Frontend
- Framework: Vue 3 + TypeScript
- Build: Vite
- State: Composables pattern
- i18n: English and Dutch locales

### Backend
- Framework: ASP.NET Core Minimal API
- Auth: OTP via email (in-memory for dev)
- Storage: In-memory (replace with DB for production)

## API Endpoints

- `POST /auth/request-otp` - Request email OTP
- `POST /auth/verify` - Verify code and issue session token
- `GET /me` - Get current user
- `GET /answers` - List user's answers
- `POST /answers` - Save/update answer
- `GET /stats/answer-likelihood` - Get likelihood scores

## Next Steps

- [ ] Replace in-memory storage with database (PostgreSQL/SQL Server)
- [ ] Add WebAuthn passkey support
- [ ] Implement email service for OTP delivery
- [ ] Deploy backend to Azure App Service
- [ ] Deploy frontend to Azure Static Web Apps
