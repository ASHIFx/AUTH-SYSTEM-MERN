# MERN Authentication System

A full-stack authentication app built with MongoDB, Express, React, and Node.js. It supports email/password sign-up, OTP email verification, login sessions with JWT refresh tokens, password reset, and Google OAuth.

## Features

- User registration and SHA-256 password hashing
- OTP-based email verification and password reset
- JWT access tokens and HTTP-only refresh-token cookies
- Google sign-in with Passport
- Protected React routes
- Rate limiting for OTP endpoints
- Transactional emails sent through Brevo

## Tech stack

| Area | Tools |
| --- | --- |
| Frontend | React, Vite, React Router, Axios, Tailwind CSS |
| Backend | Node.js, Express, Mongoose, Passport, JWT |
| Database | MongoDB |
| Email | Brevo Transactional Email API |

## Project structure

```text
BACKEND/       Express API and MongoDB models
FRONTED/       React + Vite client
```

## Getting started

### 1. Install dependencies

From the project root:

```bash
npm run install-all
```

### 2. Configure the backend

Create `BACKEND/.env` from `BACKEND/.env.example` and set the values below:

```env
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=a_long_random_secret

CLIENT_URL=http://localhost:5173

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

EMAIL_USER=your_verified_brevo_sender@example.com
BREVO_API_KEY=your_brevo_api_key
```

`EMAIL_USER` must be a sender email verified in Brevo. Generate `BREVO_API_KEY` in Brevo under **Settings → SMTP & API → API Keys & MCP**. Do not commit real secrets.

### 3. Configure the frontend

Create `FRONTED/.env`:

```env
VITE_API_URL=http://localhost:5000
```

### 4. Start the app

Run both frontend and backend from the project root:

```bash
npm run dev
```

Or start them individually:

```bash
cd BACKEND
npm run dev
```

```bash
cd FRONTED
npm run dev
```

The backend uses port `5000` by default; Vite normally runs on `5173`.

## API routes

All routes start with `/api/auth`.

| Method | Route | Purpose |
| --- | --- | --- |
| POST | `/register` | Create an account and send verification OTP |
| POST | `/login` | Sign in |
| GET | `/get-me` | Get the authenticated user |
| POST | `/refreshToken` | Issue a fresh access token |
| GET | `/logout` | Clear the current session |
| POST | `/verify-otp` | Verify registration OTP |
| GET | `/resend-otp` | Send another verification OTP |
| POST | `/forgot-password` | Send password-reset OTP |
| POST | `/verify-forgot-otp` | Validate a password-reset OTP |
| POST | `/reset-password` | Set a new password |
| GET | `/google` | Begin Google OAuth sign-in |
| GET | `/google/callback` | Google OAuth callback |

OTP routes are limited to five requests per 15 minutes.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start frontend and backend together |
| `npm run build` | Build the Vite frontend |
| `npm run start` | Start the backend in production mode |
| `npm run install-all` | Install dependencies in all project folders |

## Security notes

- Keep `.env` files private; they are ignored by Git.
- Use a long, unique `JWT_SECRET` in production.
- Configure the correct production `CLIENT_URL`, Google callback URL, and allowed Brevo sender before deployment.
