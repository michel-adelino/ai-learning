
<p align="center">
	<img src="public/logo-white.svg" alt="Simply Learn" width="320" />
</p>

<div align="center"><b>AI-First Learning Management System powered by Xano</b></div>

[![Xano Backend](https://img.shields.io/badge/Xano-Backend%20%26%20Database-00DC82?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMTIgMkw0IDdWMTdMOSAyMUwxOSAxNVY1TDEyIDJaIiBmaWxsPSJ3aGl0ZSIvPjwvc3ZnPg==)](https://www.xano.com/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![MUX Video](https://img.shields.io/badge/MUX-Video-FF5A5F?style=for-the-badge)](https://www.mux.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](./LICENSE)

---

## What is Simply Learn?

A full-stack learning platform where **students** browse courses, watch video lessons, and chat with an AI tutor. **Teachers** create courses and upload videos. The entire backend — database, auth, business logic, external integrations — runs on **[Xano](https://www.xano.com/)**. No separate Node.js/Python server needed.

📚 **[API Documentation (Swagger)](https://xr83-nvl3-j8b3.n7e.xano.io/api:CPmqNnhk)**

---

## Why Xano?

| Capability          | How Xano Powers It                                               |
| ------------------- | ---------------------------------------------------------------- |
| **Database**        | PostgreSQL tables for users, courses, modules, lessons, progress |
| **Auth**            | Built-in JWT authentication with role-based access               |
| **API Builder**     | Visual no-code endpoints with XanoScript logic                   |
| **MUX Integration** | External API calls for video upload & signed playback            |
| **Scalability**     | Production-ready infrastructure, zero DevOps                     |

Xano replaced what would typically be an entire backend codebase. All API logic lives in [Xano's visual builder](https://www.xano.com/).

---

## Tech Stack

| Layer                  | Technology                           |
| ---------------------- | ------------------------------------ |
| **Backend & Database** | [Xano](https://www.xano.com/)        |
| **Frontend**           | Next.js 16, React 19, Tailwind CSS 4 |
| **AI**                 | Google Gemini 2.5 Flash              |
| **Video**              | MUX (streaming + direct uploads)     |

---

## Quick Start

```bash
git clone https://github.com/ARYPROGRAMMER/simply-learn.git
cd simply-learn
pnpm install
cp .env.example .env.local
pnpm dev
```

### Environment Variables

```env
NEXT_PUBLIC_XANO_API_URL=https://your-instance.xano.io/api:CPmqNnhk
GOOGLE_GENERATIVE_AI_API_KEY=your-gemini-key
```

---

## Database Schema (Xano)

| Table           | Fields                                                             |
| --------------- | ------------------------------------------------------------------ |
| `users`         | id, email, password, first_name, last_name, tier, role, avatar_url |
| `categories`    | id, title, slug                                                    |
| `courses`       | id, title, slug, description, image_url, tier, teacher, featured   |
| `modules`       | id, title, course, order_index                                     |
| `lessons`       | id, title, slug, content, module, mux_playback_id, duration        |
| `user_progress` | id, user, lesson, completed, completed_at                          |

---

## API Endpoints

📚 **Full Documentation:** [Swagger](https://xr83-nvl3-j8b3.n7e.xano.io/api:CPmqNnhk)

| Endpoint                    | Method | Auth    | Description           |
| --------------------------- | ------ | ------- | --------------------- |
| `/auth/signup`              | POST   | No      | Register              |
| `/auth/login`               | POST   | No      | Login                 |
| `/auth/me`                  | GET    | Yes     | Current user          |
| `/courses`                  | GET    | No      | List courses          |
| `/courses/{slug}`           | GET    | No      | Course details        |
| `/lessons/{slug}`           | GET    | No      | Lesson details        |
| `/progress/complete-lesson` | POST   | Yes     | Mark complete         |
| `/mux/signed-tokens`        | POST   | Yes     | Video playback tokens |
| `/teacher/courses`          | POST   | Teacher | Create course         |
| `/teacher/lessons`          | POST   | Teacher | Create lesson         |

See [`xanoscript/`](./xanoscript/) for endpoint implementations.

---

## Features

**Students:** Browse courses, watch videos, track progress, AI tutor chat (Ultra tier)

**Teachers:** Create courses, manage modules/lessons, upload videos via MUX

**Tiers:** Free, Pro, Ultra subscription levels

---

## Project Structure

```
app/
├── (app)/           # Dashboard, courses, lessons, teacher portal
├── auth/            # Login/signup
└── api/chat/        # AI tutor endpoint
components/          # React components
lib/xano/            # Xano client & auth
xanoscript/          # Xano endpoint logic (20 endpoints)
```

---

## Xano Setup

1. Create workspace at [xano.com](https://www.xano.com/)
2. Create tables (schema above)
3. Add endpoints from `xanoscript/` folder
4. Set environment variables: `MUX_TOKEN_ID`, `MUX_TOKEN_SECRET`

---

## License

MIT License © 2025 [Arya Pratap Singh](https://github.com/ARYPROGRAMMER)

---

**Built with Love and Speed, Thanks to [Xano](https://www.xano.com/)**
