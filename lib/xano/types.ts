// Xano API Types

export type Tier = "free" | "pro" | "ultra";
export type Role = "student" | "teacher" | "admin";

export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  tier: Tier;
  role: Role;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  authToken: string;
  user: User;
}

export interface Category {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  image_url: string | null;
  category: number | null;
  category_data?: Category;
  tier: Tier;
  featured: boolean;
  teacher_id?: number; // FK to users table (teacher who created it)
  teacher?: Pick<User, 'id' | 'first_name' | 'last_name'>;
  module_count?: number;
  lesson_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface CourseWithModules extends Course {
  modules: ModuleWithLessons[];
  lessons?: Lesson[];
  completed_lesson_count?: number;
}

// MUX Upload Types
export interface MuxUploadUrl {
  upload_url: string;
  upload_id: string;
  asset_id: string;
}

export interface MuxAsset {
  id: string;
  playback_id: string;
  status: 'preparing' | 'ready' | 'errored';
  duration?: number;
  aspect_ratio?: string;
}

export interface Module {
  id: number;
  course: number; // FK to courses table
  title: string;
  description?: string | null;
  order_index: number;
  created_at: string;
}

export interface ModuleWithLessons extends Module {
  lessons: Lesson[];
}

export interface Lesson {
  id: number;
  module: number; // FK to modules table
  title: string;
  slug: string;
  description: string | null;
  content: string | null; // JSON or HTML content
  mux_playback_id: string | null;
  duration: number | null;
  order_index: number;
  created_at?: string;
  updated_at?: string;
  is_completed?: boolean;
}

export interface LessonWithContext extends Omit<Lesson, 'module'> {
  module: Module;
  course: CourseWithModules;
}

export interface UserProgress {
  id: number;
  user: number; // FK to users table
  lesson: number; // FK to lessons table
  completed: boolean;
  completed_at: string | null;
}

export interface Note {
  id: number;
  user: number; // FK to users table
  lesson: number; // FK to lessons table
  content: string;
  created_at: string;
  updated_at: string;
}

export interface PlatformStats {
  course_count: number;
  lesson_count: number;
}

export interface MuxTokens {
  playback: string;
  thumbnail: string;
  storyboard: string;
}

export interface MuxUploadResult {
  upload_url: string;
  upload_id: string;
}

export interface MuxAssetStatus {
  status: "waiting" | "preparing" | "ready" | "errored";
  playback_id: string | null;
  asset_id: string | null;
}

export interface SearchResult {
  courses: CourseSearchResult[];
  lessons: LessonSearchResult[];
}

export interface CourseSearchResult {
  id: number;
  title: string;
  slug: string;
  description: string;
  tier: Tier;
  category: string | null;
  url: string;
  module_count: number;
  lesson_count: number;
  modules: ModuleSearchResult[];
}

export interface ModuleSearchResult {
  title: string;
  description: string | null;
  lessons: LessonSearchResult[];
}

export interface LessonSearchResult {
  id: number;
  title: string;
  slug: string;
  description: string | null;
  content_preview: string | null;
  url: string;
}

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AIResponse {
  message: string;
  sources?: {
    course: string;
    lesson: string;
    url: string;
  }[];
}
