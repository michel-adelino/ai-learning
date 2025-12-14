# XanoScript API Endpoints

This folder contains XanoScript files to create all required API endpoints for the Simply Learn LMS platform.

## How to Use

1. Go to your Xano workspace
2. Navigate to the API section
3. Click on "XanoScript" or use the VS Code extension
4. Copy and paste each file's content to create the endpoint
5. Execute the script to create the API

## Endpoints

| File                           | Endpoint                    | Method | Auth | Description            |
| ------------------------------ | --------------------------- | ------ | ---- | ---------------------- |
| 01-auth-signup.xs              | `/auth/signup`              | POST   | No   | Register new user      |
| 02-auth-login.xs               | `/auth/login`               | POST   | No   | Login user             |
| 03-auth-me.xs                  | `/auth/me`                  | GET    | Yes  | Get current user       |
| 04-courses-list.xs             | `/courses`                  | GET    | No   | List all courses       |
| 05-courses-featured.xs         | `/courses/featured`         | GET    | No   | List featured courses  |
| 06-courses-by-slug.xs          | `/courses/{slug}`           | GET    | No   | Get course by slug     |
| 07-lessons-by-slug.xs          | `/lessons/{slug}`           | GET    | No   | Get lesson by slug     |
| 08-progress-complete-lesson.xs | `/progress/complete-lesson` | POST   | Yes  | Mark lesson complete   |
| 09-search.xs                   | `/search`                   | GET    | No   | Search courses/lessons |
| 10-mux-signed-tokens.xs        | `/mux/sign_playback`        | POST   | Yes  | Get MUX video tokens   |

### Recommended server-side input validation

The frontend performs input-length checks, but it's important to also enforce these on the backend (in Xano) using `precondition` checks in the visual builder. Suggested limits:

- `title`: max 200 chars
- `slug`: max 120 chars
- `description`: max 4000 chars
- `content`: max 20000 chars

Also ensure extreme URL paths are blocked by middleware (see `proxy.ts`).
| 19-auth-upgrade-tier.xs | `/auth/upgrade-tier` | POST | Yes | Upgrade user tier |
| 21-auth-delete-account.xs | `/delete_user_account` | DELETE | Yes | Delete user account and all data |
| 22-teacher-delete-course.xs | `/delete_course/{courseId}` | DELETE | Yes | Delete course (teacher only) |
| 23-teacher-delete-module.xs | `/teacher/modules/{moduleId}` | DELETE | Yes | Delete module (teacher only) |
| 24-teacher-delete-lesson.xs | `/teacher/lessons/{lessonId}` | DELETE | Yes | Delete lesson (teacher only) |

## Setup Order

Execute the scripts in numerical order (01 → 10).

## Prerequisites

Before creating the endpoints, ensure you have:

1. **Database Tables Created:**

   - `users` (with authentication enabled)
   - `categories`
   - `courses`
   - `modules`
   - `lessons`
   - `user_progress`

2. **Environment Variables Set (Settings → Environment Variables):**

   - `MUX_TOKEN_ID`
   - `MUX_TOKEN_SECRET`
   - `MUX_SIGNING_KEY_ID`
   - `MUX_SIGNING_KEY`

3. **Authentication Enabled:**
   - Go to `users` table settings
   - Enable authentication on the table
   - Set password field to "password"

## API Groups

Create two API groups in Xano:

1. **auth** - For authentication endpoints (01-03)
2. **main** - For all other endpoints (04-10)

Or use a single API group if preferred.

## Notes

- The `auth` setting in each script specifies whether authentication is required
- `auth = "none"` = No authentication required
- `auth = "users"` = Requires valid JWT token from the users table
- Adjust field names if your table schema differs slightly
