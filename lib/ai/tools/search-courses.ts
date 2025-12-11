import { tool } from "ai";
import { z } from "zod";
import { searchCourses as xanoSearchCourses } from "@/lib/xano/client";
import type { SearchResult, CourseSearchResult } from "@/lib/xano/types";

const courseSearchSchema = z.object({
  query: z
    .string()
    .describe(
      "The topic, skill, technology, or learning goal the user wants to learn about"
    ),
});

export const searchCoursesTool = tool({
  description:
    "Search through all courses, modules, and lessons by topic, skill, or learning goal. This searches course titles, descriptions, module content, and lesson content to find the most relevant learning material.",
  inputSchema: courseSearchSchema,
  execute: async ({ query }: z.infer<typeof courseSearchSchema>) => {
    console.log("[SearchCourses] Query received:", query);

    // Fetch courses from Xano API
    let searchResult: SearchResult;
    try {
      searchResult = await xanoSearchCourses(query);
    } catch (error) {
      console.error("[SearchCourses] Error fetching courses:", error);
      return {
        found: false,
        message: "Error searching courses. Please try again.",
        courses: [],
      };
    }

    console.log("[SearchCourses] Courses fetched:", searchResult.courses.length);

    if (searchResult.courses.length === 0) {
      return {
        found: false,
        message: "No courses, modules, or lessons found matching your query.",
        courses: [],
      };
    }

    // Format the results - already in correct format from Xano
    const formattedCourses = searchResult.courses.map((course: CourseSearchResult) => ({
      id: String(course.id),
      title: course.title,
      slug: course.slug,
      description: course.description,
      tier: course.tier,
      category: course.category,
      url: course.url,
      moduleCount: course.module_count,
      lessonCount: course.lesson_count,
      modules: course.modules.map((module) => ({
        title: module.title,
        description: module.description,
        lessons: module.lessons.map((lesson) => ({
          title: lesson.title,
          slug: lesson.slug,
          description: lesson.description,
          contentPreview: lesson.content_preview,
          lessonUrl: lesson.url,
        })),
      })),
    }));

    return {
      found: true,
      message: `Found ${formattedCourses.length} course${formattedCourses.length === 1 ? "" : "s"} with relevant content.`,
      courses: formattedCourses,
    };
  },
});
