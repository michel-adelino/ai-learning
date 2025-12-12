import { redirect } from "next/navigation";
import { getAllCourses } from "@/lib/xano/client";
import { getServerUser, getUserTier } from "@/lib/xano/server-auth";
import { DashboardClient } from "./dashboard-client";

export default async function DashboardPage() {
  const user = await getServerUser();

  if (!user) {
    redirect("/");
  }

  const [courses, userTier] = await Promise.all([
    getAllCourses().catch(() => []),
    getUserTier(),
  ]);

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
