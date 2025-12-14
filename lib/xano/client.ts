// Xano API Client

import type {
  User,
  AuthResponse,
  Course,
  CourseWithModules,
  Module,
  Lesson,
  LessonWithContext,
  PlatformStats,
  MuxTokens,
  MuxUploadUrl,
  MuxUploadStatus,
  MuxAsset,
  SearchResult,
  ChatMessage,
  AIResponse,
  UserProgress,
} from "./types";

const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";

// Input validation limits (server-side guard in client helper)
const MAX_TITLE_LENGTH = 200;
const MAX_SLUG_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 4000;
const MAX_CONTENT_LENGTH = 20000;

class XanoApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "XanoApiError";
    this.status = status;
  }
}

async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {},
  authToken?: string | null
): Promise<T> {
  if (!XANO_API_URL) {
    throw new XanoApiError(
      "Environment variable NEXT_PUBLIC_XANO_API_URL is not set. Set NEXT_PUBLIC_XANO_API_URL to your Xano base URL (e.g. https://your-instance.xano.io) in your .env and restart the dev server.",
      500
    );
  }
  const base = XANO_API_URL.replace(/\/+$/, "");
  const path = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (authToken) {
    (headers as Record<string, string>)[
      "Authorization"
    ] = `Bearer ${authToken}`;
  }

  const response = await fetch(`${base}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new XanoApiError(
      errorData.message || `Request failed with status ${response.status}`,
      response.status
    );
  }

  return response.json();
}

// ============ Auth API ============

export async function signup(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string,
  role?: "student" | "teacher"
): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/signup", {
    method: "POST",
    body: JSON.stringify({
      email,
      password,
      first_name: firstName,
      last_name: lastName,
      role: role || "student",
    }),
  });
}

export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  return fetchApi<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getCurrentUser(authToken: string): Promise<User> {
  return fetchApi<User>("/auth/me", {}, authToken);
}

export async function updateProfile(
  authToken: string,
  data: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
  }
): Promise<User> {
  return fetchApi<User>(
    "/auth/profile",
    {
      method: "PATCH",
      body: JSON.stringify(data),
    },
    authToken
  );
}

export async function upgradeTier(
  authToken: string,
  tier: "pro" | "ultra"
): Promise<User> {
  return fetchApi<User>(
    "/auth/upgrade-tier",
    {
      method: "POST",
      body: JSON.stringify({ tier }),
    },
    authToken
  );
}

// ============ Courses API ============

interface CoursesListResponse {
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
  // Optional users list if the API returns teacher/user data alongside courses
  users?: Pick<import("./types").User, "id" | "first_name" | "last_name">[];
}

export async function getAllCourses(): Promise<Course[]> {
  const response = await fetchApi<CoursesListResponse>("/courses");

  // Map users (if returned) by id for quick lookup. If the `/courses` endpoint
  // did not include `users`, try fetching `/users` as a fallback so server-side
  // rendered pages get teacher names.
  const userMap = new Map<
    number,
    { id: number; first_name: string | null; last_name: string | null }
  >();
  if (response.users && Array.isArray(response.users)) {
    for (const u of response.users) {
      userMap.set(u.id as number, {
        id: u.id as number,
        first_name: u.first_name ?? null,
        last_name: u.last_name ?? null,
      });
    }
  } else {
    try {
      const users = await fetchApi<
        Pick<User, "id" | "first_name" | "last_name">[]
      >("/users");
      if (users && Array.isArray(users)) {
        for (const u of users) {
          userMap.set(u.id as number, {
            id: u.id as number,
            first_name: u.first_name ?? null,
            last_name: u.last_name ?? null,
          });
        }
      }
    } catch (err) {
      // ignore — best-effort fallback
    }
  }

  return response.courses.map((course) => {
    const teacherId =
      course.teacher_id ??
      (typeof course.teacher === "number" ? course.teacher : null);
    const attachedTeacher = teacherId
      ? userMap.get(teacherId) ?? undefined
      : undefined;
    return {
      ...course,
      module_count: response.modules.filter((m) => m.course === course.id)
        .length,
      lesson_count: response.lessons.filter((l) =>
        response.modules.some(
          (m) => m.id === l.module && m.course === course.id
        )
      ).length,
      teacher: attachedTeacher,
      teacher_id: teacherId ?? undefined,
    };
  });
}

export async function getFeaturedCourses(): Promise<Course[]> {
  const response = await fetchApi<CoursesListResponse>("/courses/featured");

  // Calculate module and lesson counts for each course
  return response.courses.map((course) => ({
    ...course,
    module_count: response.modules.filter((m) => m.course === course.id).length,
    lesson_count: response.lessons.filter((l) =>
      response.modules.some((m) => m.id === l.module && m.course === course.id)
    ).length,
  }));
}

export async function getCourseBySlug(
  slug: string
): Promise<CourseWithModules> {
  return fetchApi<CourseWithModules>(`/courses/${slug}`);
}

export async function getCourseWithProgress(
  slug: string,
  authToken: string
): Promise<CourseWithModules> {
  // For now, just get the course without progress since endpoint doesn't exist
  return fetchApi<CourseWithModules>(`/courses/${slug}`, {}, authToken);
}

// Get user's courses with their progress
// Note: This uses the regular /courses endpoint since /courses/my-progress doesn't exist yet
export async function getUserCoursesWithProgress(authToken: string): Promise<
  Array<
    Course & {
      completed_lesson_count: number;
      lesson_count: number;
      module_count: number;
      is_completed: boolean;
    }
  >
> {
  // Fallback to regular courses list - progress tracking would need to be added to Xano
  const courses = await fetchApi<Course[]>("/courses", {}, authToken);
  return courses.map((course) => ({
    ...course,
    completed_lesson_count: 0,
    lesson_count: course.lesson_count || 0,
    module_count: course.module_count || 0,
    is_completed: false,
  }));
}

// ============ Lessons API ============

export async function getLessonBySlug(
  slug: string
): Promise<LessonWithContext> {
  // The Xano `/lessons/{slug}` endpoint returns a lesson with a `course`
  // object that includes `modules` and `all_lessons` separately. The
  // frontend expects each module to include its `lessons` array. Map the
  // response to attach lessons to their parent modules.
  const raw = await fetchApi<any>(`/lessons/${slug}`);

  const lesson: any = raw;
  const course = lesson.course || null;

  if (
    course &&
    Array.isArray(course.modules) &&
    Array.isArray(course.all_lessons)
  ) {
    const modulesWithLessons = course.modules.map((m: any) => ({
      ...m,
      lessons: course.all_lessons.filter((l: any) => l.module === m.id),
    }));

    lesson.course = {
      ...course,
      modules: modulesWithLessons,
    };
  }

  return lesson as LessonWithContext;
}

// ============ Progress API ============

export async function completeLesson(
  authToken: string,
  lessonId: number
): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(
    "/progress/complete-lesson",
    {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId }),
    },
    authToken
  );
}

export async function uncompleteLesson(
  authToken: string,
  lessonId: number
): Promise<{ success: boolean }> {
  return fetchApi<{ success: boolean }>(
    "/progress/uncomplete-lesson",
    {
      method: "POST",
      body: JSON.stringify({ lesson_id: lessonId }),
    },
    authToken
  );
}

export async function getCourseProgress(
  authToken: string,
  courseId: number
): Promise<{
  completed_count: number;
  total_count: number;
  progress_percentage: number;
  completed_lessons: number[];
}> {
  // Fallback - progress tracking endpoint doesn't exist yet
  // Return empty progress for now
  return {
    completed_count: 0,
    total_count: 0,
    progress_percentage: 0,
    completed_lessons: [],
  };
}

// ============ Stats API ============

export async function getPlatformStats(): Promise<PlatformStats> {
  // Fallback stats since /stats endpoint doesn't exist in Xano
  // You can create this endpoint in Xano or use hardcoded values
  try {
    const courses = await fetchApi<Course[]>("/courses");
    return {
      course_count: courses.length,
      lesson_count: courses.reduce((acc, c) => acc + (c.lesson_count || 0), 0),
    };
  } catch {
    return { course_count: 10, lesson_count: 50 };
  }
}

// ============ Search API ============

export async function searchCourses(
  query: string,
  page = 1,
  perPage = 20
): Promise<SearchResult> {
  return fetchApi<SearchResult>(
    `/search?query=${encodeURIComponent(
      query
    )}&page=${page}&per_page=${perPage}`
  );
}

// ============ Teacher API ============

interface TeacherCoursesResponse {
  courses: Course[];
  modules: Module[];
  lessons: Lesson[];
}

export async function getTeacherCourses(authToken: string): Promise<Course[]> {
  const response = await fetchApi<TeacherCoursesResponse>(
    "/teacher/courses",
    {},
    authToken
  );

  // Attach module and lesson counts to each course
  return response.courses.map((course) => ({
    ...course,
    module_count: response.modules.filter((m) => m.course === course.id).length,
    lesson_count: response.lessons.filter((l) =>
      response.modules.some((m) => m.id === l.module && m.course === course.id)
    ).length,
  }));
}

export async function getTeacherCourseById(
  authToken: string,
  courseId: number
): Promise<CourseWithModules> {
  return fetchApi<CourseWithModules>(
    `/teacher/courses/${courseId}`,
    {},
    authToken
  );
}

export async function createCourse(
  authToken: string,
  data: {
    title: string;
    slug: string;
    description: string;
    image_url?: string;
    category?: number;
    tier?: "free" | "pro" | "ultra";
  }
): Promise<Course> {
  // Server-side guard: validate input sizes before sending to Xano
  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    throw new XanoApiError("Title too long", 400);
  }
  if (data.slug && data.slug.length > MAX_SLUG_LENGTH) {
    throw new XanoApiError("Slug too long", 400);
  }
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    throw new XanoApiError("Description too long", 400);
  }
  return fetchApi<Course>(
    "/teacher/courses",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    authToken
  );
}

export async function createModule(
  authToken: string,
  data: {
    course_id: number;
    title: string;
    description?: string;
    order_index?: number;
  }
): Promise<Module> {
  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    throw new XanoApiError("Module title too long", 400);
  }
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    throw new XanoApiError("Module description too long", 400);
  }
  return fetchApi<Module>(
    "/teacher/modules",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    authToken
  );
}

export async function createLesson(
  authToken: string,
  data: {
    module_id: number;
    title: string;
    slug: string;
    description?: string;
    content?: string;
    mux_playback_id?: string;
    duration?: number;
    order_index?: number;
  }
): Promise<Lesson> {
  if (data.title && data.title.length > MAX_TITLE_LENGTH) {
    throw new XanoApiError("Lesson title too long", 400);
  }
  if (data.slug && data.slug.length > MAX_SLUG_LENGTH) {
    throw new XanoApiError("Lesson slug too long", 400);
  }
  if (data.description && data.description.length > MAX_DESCRIPTION_LENGTH) {
    throw new XanoApiError("Lesson description too long", 400);
  }
  if (data.content && data.content.length > MAX_CONTENT_LENGTH) {
    throw new XanoApiError("Lesson content too long", 400);
  }
  return fetchApi<Lesson>(
    "/teacher/lessons",
    {
      method: "POST",
      body: JSON.stringify(data),
    },
    authToken
  );
}

// ============ MUX API ============

export async function createMuxUploadUrl(
  authToken: string,
  corsOrigin?: string
): Promise<MuxUploadUrl> {
  return fetchApi<MuxUploadUrl>(
    "/mux/upload-url",
    {
      method: "POST",
      body: JSON.stringify({ cors_origin: corsOrigin }),
    },
    authToken
  );
}

export async function getMuxUploadStatus(
  authToken: string,
  uploadId: string
): Promise<MuxUploadStatus> {
  return fetchApi<MuxUploadStatus>(
    `/mux/get_upload?upload_id=${encodeURIComponent(uploadId)}`,
    {},
    authToken
  );
}

export async function getMuxAssetStatus(
  authToken: string,
  assetId: string
): Promise<MuxAsset> {
  return fetchApi<MuxAsset>(
    `/mux/get_asset?asset_id=${encodeURIComponent(assetId)}`,
    {},
    authToken
  );
}

export async function getMuxSignedTokens(
  authToken: string,
  playbackId: string
): Promise<MuxTokens> {
  return fetchApi<MuxTokens>(
    "/mux/sign_playback",
    {
      method: "POST",
      body: JSON.stringify({ playback_id: playbackId }),
    },
    authToken
  );
}

// ============ Deletion API ============

export async function deleteAccount(
  authToken: string
): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>(
    "/delete_user_account",
    {
      method: "DELETE",
    },
    authToken
  );
}

export async function deleteCourse(
  authToken: string,
  courseId: number
): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>(
    `delete_course/${courseId}`,
    {
      method: "DELETE",
    },
    authToken
  );
}

export async function deleteModule(
  authToken: string,
  moduleId: number
): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>(
    `teacher/modules/${moduleId}`,
    {
      method: "DELETE",
    },
    authToken
  );
}

export async function deleteLesson(
  authToken: string,
  lessonId: number
): Promise<{ success: boolean; message: string }> {
  return fetchApi<{ success: boolean; message: string }>(
    `teacher/lessons/${lessonId}`,
    {
      method: "DELETE",
    },
    authToken
  );
}

// ============ AI API ============

export async function chatWithTutor(
  authToken: string,
  messages: ChatMessage[]
): Promise<AIResponse> {
  return fetchApi<AIResponse>(
    "/ai/chat",
    {
      method: "POST",
      body: JSON.stringify({ messages }),
    },
    authToken
  );
}

export async function searchAndAnswer(
  authToken: string,
  query: string
): Promise<AIResponse> {
  return fetchApi<AIResponse>(
    "/ai/search-and-answer",
    {
      method: "POST",
      body: JSON.stringify({ query }),
    },
    authToken
  );
}

// ============ Server-side helpers ============

// For server components that need to fetch with auth
export async function fetchWithAuth<T>(
  endpoint: string,
  authToken: string | null,
  options: RequestInit = {}
): Promise<T> {
  return fetchApi<T>(endpoint, options, authToken);
}

// Export error class for error handling
export { XanoApiError };
