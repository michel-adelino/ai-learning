import { redirect } from "next/navigation";
import { getAllCourses } from "@/lib/xano/client";
import { getServerUser, getUserTier } from "@/lib/xano/server-auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  let courses: any[] = [];
  const userTierPromise = getUserTier();
  try {
    courses = await getAllCourses();
  } catch (err) {
    // Log server-side so you can see the error in the dev server console
    courses = [];
  }

  const userTier = await userTierPromise;

  const firstName = user.first_name ?? "there";

  return (
    <DashboardClient
      firstName={firstName}
      userTier={userTier}
      transformedCourses={courses}
      userId={String(user.id)}
    />
  );
}
