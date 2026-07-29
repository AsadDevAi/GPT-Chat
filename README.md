# GPT Chat — Production-Ready AI Chat Clone

A full-stack ChatGPT clone built with React + Vite + TypeScript (frontend), Node.js + Express + TypeScript (backend), MongoDB, Groq API streaming, and JWT authentication with email verification.

## Features

- **Real-time AI streaming** via Groq API (SSE)
- **Multi-chat management** with auto-generated titles
- **Email auth** — register, verify email, login, forgot/reset password (Resend)
- **JWT** access token (15min) + refresh token (httpOnly cookie, 7d)
- **Dark/Light mode** toggle
- **Markdown rendering** with syntax highlighting
- **Responsive design** — mobile sidebar hamburger menu
- **Rate limiting** on auth and AI endpoints

---

## Project Structure

```
GPT-Chat/
├── client/          # React + Vite + TypeScript + Tailwind + shadcn/ui
└── server/          # Node.js + Express + TypeScript (MVC)
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or MongoDB Atlas)
- Groq API key ([console.groq.com](https://console.groq.com))
- Resend API key ([resend.com](https://resend.com))

### 1. Backend Setup

```bash
cd server
cp .env.example .env
# Edit .env with your values
npm install
npm run dev
```

Server runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd client
cp .env.example .env
# Edit .env: VITE_API_URL=http://localhost:5000
npm install
npm run dev
```

Client runs on `http://localhost:5173`

---

## Environment Variables

### Server (`server/.env`)

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for access tokens (min 32 chars) |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens (min 32 chars) |
| `GROQ_API_KEY` | Groq API key from console.groq.com |
| `RESEND_API_KEY` | Resend API key from resend.com |
| `CLIENT_URL` | Frontend URL (e.g., `https://your-app.vercel.app`) |
| `PORT` | Server port (default: `5000`) |
| `NODE_ENV` | `development` or `production` |
| `FROM_EMAIL` | Sender email (must be a verified Resend domain) |
| `GROQ_MODEL` | Groq model (default: `llama-3.3-70b-versatile`) |

### Client (`client/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (e.g., `https://your-api.railway.app`) |

---

## Deploy

### Backend → Railway

1. Create a new Railway project
2. Connect your GitHub repo (or push the `server/` folder)
3. Set environment variables in Railway dashboard
4. Railway auto-detects `railway.json` — build and deploy happens automatically
5. Your backend URL will be something like `https://your-api.railway.app`

### Frontend → Vercel

1. Import the `client/` folder to Vercel
2. Set environment variable: `VITE_API_URL=https://your-api.railway.app`
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. The `vercel.json` handles SPA routing rewrites

---

## API Endpoints

### Auth (`/api/auth`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/register` | No | Register (sends verification email) |
| POST | `/verify-email` | No | Verify email with token |
| POST | `/login` | No | Login (returns access token + sets refresh cookie) |
| POST | `/refresh` | No | Refresh access token |
| POST | `/logout` | No | Clear refresh cookie |
| POST | `/forgot-password` | No | Send password reset email |
| POST | `/reset-password` | No | Reset password with token |
| GET | `/me` | Yes | Get current user |

### Chats (`/api/chats`)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get all user's chats |
| POST | `/` | Create a new chat |
| DELETE | `/:id` | Delete a chat |
| PATCH | `/:id` | Rename a chat |
| GET | `/:id/messages` | Get chat messages |
| POST | `/:id/messages` | Send message (SSE streaming response) |
| POST | `/:id/regenerate` | Regenerate last AI response |

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, TypeScript, Tailwind CSS v4, shadcn/ui |
| State | Zustand |
| Routing | React Router v6 |
| HTTP | Axios |
| Backend | Node.js, Express, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs, httpOnly cookies |
| AI | Groq API (`llama-3.3-70b-versatile`), SSE streaming |
| Email | Resend |
| Validation | Zod |
| Rate Limiting | express-rate-limit |
| Markdown | react-markdown, rehype-highlight, remark-gfm |
