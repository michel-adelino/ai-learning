"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const AUTH_TOKEN_COOKIE = "xano_auth_token";
const XANO_API_URL = process.env.NEXT_PUBLIC_XANO_API_URL || "";

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function toggleCourseCompletion(
  courseId: number,
  courseSlug: string,
  markComplete: boolean
): Promise<{ success: boolean; isCompleted: boolean }> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return { success: false, isCompleted: false };
  }

  try {
    const endpoint = markComplete
      ? "/progress/complete-course"
      : "/progress/uncomplete-course";

    const response = await fetch(`${XANO_API_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ course_id: courseId }),
    });

    if (!response.ok) {
      throw new Error("Failed to update course completion");
    }

    revalidatePath(`/courses/${courseSlug}`);
    revalidatePath("/dashboard");

    return { success: true, isCompleted: markComplete };
  } catch (error) {
    console.error("Failed to toggle course completion:", error);
    return { success: false, isCompleted: !markComplete };
  }
}
