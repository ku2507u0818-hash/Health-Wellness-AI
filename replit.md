# ArogyaAI - Health & Wellness Platform

## Overview

A full-stack AI-powered Health & Wellness platform built with React + Vite (frontend) and Express (backend). Uses Anthropic Claude for AI health analysis, PostgreSQL for data storage, JWT for authentication, and supports 3 languages (English, Hindi, Gujarati).

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: Anthropic Claude via Replit AI Integrations
- **Auth**: JWT + bcryptjs

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── api-server/         # Express API server
│   └── arogyaai/           # React + Vite frontend
├── lib/
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   ├── db/                 # Drizzle ORM schema + DB connection
│   └── integrations-anthropic-ai/  # Anthropic AI integration
├── scripts/                # Utility scripts
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## Features

- Landing, Login, Signup, Dashboard, HealthCheck, Reports, TipsLibrary, Profile pages
- Multi-language support (EN/HI/GU)
- Dark mode toggle
- Font size accessibility
- ArogyaScore (0-100) circular progress UI
- Health streak tracking
- AI analysis with 6 color-coded sections
- Rate limiting (5 AI requests per hour per user)
- Print-to-PDF support
- Toast notifications

## Database Tables

- `users` - Auth + profile data (id, email, password_hash, name, age, gender, language, health_streak, arogya_score)
- `health_reports` - AI analysis history (id, user_id, symptoms, lifestyle, severity, analysis, arogya_score, language)
- `wellness_tips` - Tips library with multilingual content (id, category, title_en/hi/gu, content_en/hi/gu, icon)
- `rate_limits` - API rate limiting (id, user_id, action, window_start, request_count)

## API Routes (all prefixed /api)

- `POST /auth/signup` — Register
- `POST /auth/login` — Login
- `GET /auth/me` — Current user (auth required)
- `POST /health/analyze` — AI health analysis (auth required, rate limited)
- `GET /reports` — List user reports (auth required)
- `GET /reports/:id` — Single report (auth required)
- `GET /tips` — Wellness tips (public)
- `GET /profile` — User profile (auth required)
- `PUT /profile` — Update profile (auth required)
- `GET /profile/dashboard` — Dashboard data (auth required)

## Key Notes

- AI Integration uses Replit's managed Anthropic keys (no API key needed from user)
- JWT secret defaults to `arogya-secret-key-2024` if JWT_SECRET env var not set
- Rate limit: max 5 AI analyses per user per hour
- Health streak updates automatically on each AI analysis
- ArogyaScore is a rolling average (70% old + 30% new)
