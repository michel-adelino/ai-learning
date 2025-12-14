"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/lib/xano/auth-context";
import { createCourse } from "@/lib/xano/client";

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export default function NewCoursePage() {
  const router = useRouter();
  const { authToken, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tier, setTier] = useState<"free" | "pro" | "ultra">("free");

  // Validation functions
  const validateTitle = (title: string): string | null => {
    if (!title.trim()) return "Course title is required";
    if (title.trim().length < 3)
      return "Course title must be at least 3 characters long";
    if (title.trim().length > 100)
      return "Course title must be less than 100 characters";
    return null;
  };

  const validateSlug = (slug: string): string | null => {
    if (!slug.trim()) return "URL slug is required";
    if (!/^[a-z0-9-]+$/.test(slug))
      return "Slug can only contain lowercase letters, numbers, and hyphens";
    if (slug.length < 3) return "Slug must be at least 3 characters long";
    if (slug.length > 50) return "Slug must be less than 50 characters";
    if (slug.startsWith("-") || slug.endsWith("-"))
      return "Slug cannot start or end with a hyphen";
    return null;
  };

  const validateDescription = (description: string): string | null => {
    if (!description.trim()) return "Course description is required";
    if (description.trim().length < 10)
      return "Description must be at least 10 characters long";
    if (description.trim().length > 1000)
      return "Description must be less than 1000 characters";
    return null;
  };

  const validateUrl = (url: string): string | null => {
    if (!url.trim()) return null; // URL is optional
    try {
      new URL(url);
      // Check if it's a valid image URL (basic check)
      const validExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".gif",
        ".webp",
        ".svg",
      ];
      const lowerUrl = url.toLowerCase();
      const hasValidExtension = validExtensions.some((ext) =>
        lowerUrl.includes(ext)
      );
      if (!hasValidExtension) {
        return "URL must point to an image file (JPG, PNG, GIF, WebP, SVG)";
      }
      return null;
    } catch {
      return "Please enter a valid URL";
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    const titleError = validateTitle(title);
    if (titleError) errors.title = titleError;

    const slugError = validateSlug(slug);
    if (slugError) errors.slug = slugError;

    const descriptionError = validateDescription(description);
    if (descriptionError) errors.description = descriptionError;

    const urlError = validateUrl(imageUrl);
    if (urlError) errors.imageUrl = urlError;

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setError(null);
    setFieldErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const course = await createCourse(authToken, {
        title,
        slug,
        description,
        image_url: imageUrl || undefined,
        tier,
      });

      router.push(`/teacher/courses/${course.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course");
    } finally {
      setIsLoading(false);
    }
  };

  // Check if user is teacher
  if (user && user.role !== "teacher") {
    return (
      <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Access Denied</h2>
          <p className="text-zinc-400">Only teachers can create courses.</p>
          <Link href="/dashboard">
            <Button className="mt-4">Go to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-white">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-zinc-600/10 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-2xl">
        {/* Back button */}
        <Link
          href="/teacher"
          className="inline-flex items-center text-zinc-300 hover:text-white transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>

        <div className="bg-zinc-900/60 border border-zinc-700/50 rounded-2xl p-8 backdrop-blur-sm">
          <h1 className="text-2xl font-bold mb-6">Create New Course</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-200 font-medium">
                Course Title *
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Introduction to Web Development"
                required
                maxLength={100}
                className={`bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 ${
                  fieldErrors.title
                    ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {fieldErrors.title && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-200 font-medium">
                URL Slug *
              </Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="introduction-to-web-development"
                required
                maxLength={50}
                className={`bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 ${
                  fieldErrors.slug
                    ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {fieldErrors.slug && (
                <p className="text-red-400 text-xs mt-1">{fieldErrors.slug}</p>
              )}
              <p className="text-xs text-zinc-400">
                This will be used in the URL: /courses/{slug || "your-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-zinc-200 font-medium"
              >
                Description *
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn in this course..."
                required
                rows={4}
                maxLength={1000}
                className={`bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 ${
                  fieldErrors.description
                    ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {fieldErrors.description && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.description}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-zinc-200 font-medium">
                Cover Image URL
              </Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                maxLength={200}
                className={`bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500 ${
                  fieldErrors.imageUrl
                    ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                    : ""
                }`}
              />
              {fieldErrors.imageUrl && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.imageUrl}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier" className="text-zinc-200 font-medium">
                Access Tier
              </Label>
              <Select
                value={tier}
                onValueChange={(v) => setTier(v as typeof tier)}
              >
                <SelectTrigger className="bg-zinc-900/80 border-zinc-700 text-white">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem className="text-white" value="free">
                    Free - Everyone
                  </SelectItem>
                  <SelectItem className="text-white" value="pro">
                    Pro - Pro & Ultra members
                  </SelectItem>
                  <SelectItem className="text-white" value="ultra">
                    Ultra - Ultra members only
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
                {error}
              </div>
            )}

            <div className="flex gap-4">
              <Link href="/teacher" className="flex-1">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </Link>
              <Button
                type="submit"
                className="flex-1 bg-zinc-100 hover:bg-white text-zinc-900"
                disabled={isLoading || !title || !slug || !description}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
