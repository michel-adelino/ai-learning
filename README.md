# Simply Learn - AI-Powered Learning Management System

![Simply Learn](public/logo-black.svg)

[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![Xano](https://img.shields.io/badge/Xano-Backend-00DC82)](https://www.xano.com/)
[![Gemini](https://img.shields.io/badge/Gemini-AI-4285F4?logo=google)](https://ai.google.dev/)
[![MUX](https://img.shields.io/badge/MUX-Video-FF5A5F)](https://www.mux.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

A modern Learning Management System with role-based access (students & teachers), MUX video streaming, and Gemini AI-powered tutoring.

---

## ✨ Features

### For Students
- 🎓 **Course Catalog** - Browse and enroll in courses
- 📹 **Video Learning** - Stream lessons with MUX player
- 🤖 **AI Tutor** - Gemini-powered assistant (Ultra tier)
- 📊 **Progress Tracking** - Track completion across courses
- 🎯 **Tiered Access** - Free, Pro, and Ultra subscriptions

### For Teachers
- 📚 **Course Creation** - Create and manage courses
- 🎬 **Video Upload** - Direct upload to MUX with progress tracking
- 📝 **Module & Lesson Management** - Organize content hierarchically
- 📈 **Dashboard** - Overview of all created content

### Security
- 🔐 **JWT Authentication** - Secure login/signup with Xano
- 🛡️ **Role-Based Access** - Student, Teacher roles
- 🚧 **Route Protection** - Middleware-based auth guards

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **Xano** | Backend-as-a-Service (database, auth, API) |
| **MUX** | Video hosting, streaming & direct uploads |
| **Google Gemini** | AI tutor (`gemini-2.5-flash`) |
| **Tailwind CSS 4** | Styling |

---

## 🚀 Quick Start

```bash
# Clone and install
git clone <your-repo-url>
cd lms-platform
pnpm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔧 Environment Variables

Create `.env.local`:

```env
# Xano Backend
NEXT_PUBLIC_XANO_API_URL=https://your-instance.xano.io/api:main

# Google Gemini AI
GOOGLE_GENERATIVE_AI_API_KEY=your-google-ai-api-key

# MUX (for signed playback - optional)
NEXT_PUBLIC_MUX_ENV_KEY=your-mux-environment-key
```

---

## 📋 Complete Setup Guide

### 1. Xano Setup

1. Create account at [xano.com](https://www.xano.com/)
2. Create a new workspace

#### Database Tables

Create these tables in Xano:

**users**
| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Auto PK |
| email | Text | Unique |
| password | Password | |
| first_name | Text | |
| last_name | Text | |
| tier | Enum | `free` / `pro` / `ultra` (default: free) |
| role | Enum | `student` / `teacher` (default: student) |
| avatar_url | Text | Optional |
| created_at | Timestamp | |

**categories**
| Field | Type |
|-------|------|
| id | Integer |
| title | Text |
| slug | Text |

**courses**
| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Auto PK |
| title | Text | |
| slug | Text | Unique |
| description | Text | |
| image_url | Text | Optional |
| tier | Enum | `free` / `pro` / `ultra` |
| category | Integer | FK → categories |
| teacher | Integer | FK → users |
| featured | Boolean | Default: false |
| created_at | Timestamp | |

**modules**
| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Auto PK |
| title | Text | |
| course | Integer | FK → courses |
| order_index | Integer | |
| created_at | Timestamp | |

**lessons**
| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Auto PK |
| title | Text | |
| slug | Text | Unique |
| description | Text | |
| content | Text | Markdown content |
| module | Integer | FK → modules |
| order_index | Integer | |
| mux_playback_id | Text | MUX playback ID |
| duration | Integer | Seconds |
| created_at | Timestamp | |

**user_progress**
| Field | Type | Notes |
|-------|------|-------|
| id | Integer | Auto PK |
| user | Integer | FK → users |
| lesson | Integer | FK → lessons |
| completed | Boolean | |
| completed_at | Timestamp | |

#### API Endpoints

Create these endpoints (see `xanoscript/` folder for implementation):

**Authentication**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/signup` | No | Register new user |
| POST | `/auth/login` | No | User login |
| GET | `/auth/me` | Yes | Get current user |

**Courses (Public)**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/courses` | No | List all courses |
| GET | `/courses/featured` | No | Featured courses |
| GET | `/courses/:slug` | No | Course details |
| GET | `/search?q=` | No | Search courses |

**Lessons & Progress**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/lessons/:slug` | No | Lesson details |
| POST | `/progress/complete-lesson` | Yes | Mark lesson complete |
| POST | `/mux/signed-tokens` | Yes | Get signed playback tokens |

**Teacher Endpoints**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/teacher/courses` | Yes (Teacher) | List teacher's courses |
| GET | `/teacher/courses/:id` | Yes (Teacher) | Course with modules/lessons |
| POST | `/teacher/courses` | Yes (Teacher) | Create course |
| POST | `/teacher/modules` | Yes (Teacher) | Create module |
| POST | `/teacher/lessons` | Yes (Teacher) | Create lesson |

**MUX Video Upload**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/mux/upload-url` | Yes (Teacher) | Get direct upload URL |
| GET | `/mux/asset/:id` | Yes (Teacher) | Check upload status |

#### Xano Environment Variables

In Xano Settings → Environment Variables, add:

```
MUX_TOKEN_ID=your-mux-token-id
MUX_TOKEN_SECRET=your-mux-token-secret
MUX_SIGNING_KEY_ID=your-signing-key-id (optional)
MUX_SIGNING_KEY=your-signing-key (optional)
```

### 2. MUX Setup

1. Create account at [mux.com](https://www.mux.com/)
2. Go to **Settings → API Access Tokens**
3. Create token with **Mux Video** read/write permissions
4. Copy Token ID and Secret to Xano env vars
5. (Optional) For signed playback: **Settings → Signing Keys**

### 3. Google AI Setup

1. Go to [Google AI Studio](https://aistudio.google.com/)
2. Create API key
3. Add to `.env.local` as `GOOGLE_GENERATIVE_AI_API_KEY`

---

## 📁 Project Structure

```
├── app/
│   ├── (app)/              # Main app routes
│   │   ├── dashboard/      # Student dashboard
│   │   ├── courses/        # Course pages
│   │   ├── lessons/        # Lesson pages
│   │   ├── teacher/        # Teacher dashboard & forms
│   │   └── pricing/        # Subscription plans
│   ├── auth/               # Login/signup pages
│   └── api/chat/           # AI tutor endpoint
├── components/
│   ├── auth/               # Auth forms & user button
│   ├── courses/            # Course cards, lists, content
│   ├── lessons/            # Lesson player, sidebar
│   ├── teacher/            # MUX upload component
│   ├── tutor/              # AI tutor widget
│   └── ui/                 # Shadcn/ui components
├── lib/
│   ├── xano/               # Xano client, auth, types
│   ├── actions/            # Server actions
│   └── ai/                 # AI tutor agent
├── xanoscript/             # Xano endpoint implementations
└── proxy.ts                # Route protection (Next.js 16)
```

---

## 👤 User Roles

| Role | Capabilities |
|------|--------------|
| **Student** | Browse courses, watch lessons, track progress, use AI tutor (Ultra) |
| **Teacher** | All student capabilities + create courses, upload videos |

---

## 📜 Scripts

```bash
pnpm dev        # Start development server
pnpm build      # Build for production
pnpm start      # Start production server
pnpm lint       # Run Biome linter
pnpm typecheck  # TypeScript type checking
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Other Platforms

Build and run:

```bash
pnpm build
pnpm start
```

---

## 📝 XanoScript Reference

The `xanoscript/` folder contains pseudocode for all Xano endpoints:

| File | Endpoint |
|------|----------|
| `01-auth-signup.xs` | POST /auth/signup |
| `02-auth-login.xs` | POST /auth/login |
| `03-auth-me.xs` | GET /auth/me |
| `04-courses-list.xs` | GET /courses |
| `05-courses-featured.xs` | GET /courses/featured |
| `06-courses-by-slug.xs` | GET /courses/:slug |
| `07-lessons-by-slug.xs` | GET /lessons/:slug |
| `08-progress-complete-lesson.xs` | POST /progress/complete-lesson |
| `09-search.xs` | GET /search |
| `10-mux-signed-tokens.xs` | POST /mux/signed-tokens |
| `11-teacher-create-course.xs` | POST /teacher/courses |
| `12-teacher-create-module.xs` | POST /teacher/modules |
| `13-teacher-create-lesson.xs` | POST /teacher/lessons |
| `14-teacher-get-courses.xs` | GET /teacher/courses |
| `15-mux-create-upload.xs` | POST /mux/upload-url |
| `16-mux-get-asset.xs` | GET /mux/asset/:id |
| `17-teacher-get-course.xs` | GET /teacher/courses/:id |

---

## 📄 License

[CC BY-NC 4.0](./LICENSE.md) - Free for non-commercial use with attribution.

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

---

Built with ❤️ using Next.js, Xano, MUX, and Google Gemini
