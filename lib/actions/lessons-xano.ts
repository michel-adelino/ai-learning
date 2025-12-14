"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { completeLesson, uncompleteLesson } from "@/lib/xano/client";

const AUTH_TOKEN_COOKIE = "xano_auth_token";

async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_TOKEN_COOKIE)?.value ?? null;
}

export async function toggleLessonCompletion(
  lessonId: number,
  lessonSlug: string,
  markComplete: boolean
): Promise<{ success: boolean; isCompleted: boolean }> {
  const authToken = await getAuthToken();

  if (!authToken) {
    return { success: false, isCompleted: false };
  }

  try {
    if (markComplete) {
      await completeLesson(authToken, lessonId);
    } else {
      await uncompleteLesson(authToken, lessonId);
    }

    revalidatePath(`/lessons/${lessonSlug}`);
    revalidatePath("/dashboard");

    return { success: true, isCompleted: markComplete };
  } catch (error) {
    return { success: false, isCompleted: !markComplete };
  }
}
