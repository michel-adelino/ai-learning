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

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [tier, setTier] = useState<"free" | "pro" | "ultra">("free");

  // Auto-generate slug from title
  const handleTitleChange = (value: string) => {
    setTitle(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authToken) return;

    setIsLoading(true);
    setError(null);

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
              <Label htmlFor="title" className="text-zinc-200 font-medium">Course Title *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder="e.g., Introduction to Web Development"
                required
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-200 font-medium">URL Slug *</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="introduction-to-web-development"
                required
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
              />
              <p className="text-xs text-zinc-400">
                This will be used in the URL: /courses/{slug || "your-slug"}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-zinc-200 font-medium">Description *</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe what students will learn in this course..."
                required
                rows={4}
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-zinc-200 font-medium">Cover Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-zinc-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier" className="text-zinc-200 font-medium">Access Tier</Label>
              <Select value={tier} onValueChange={(v) => setTier(v as typeof tier)}>
                <SelectTrigger className="bg-zinc-900/80 border-zinc-700 text-white">
                  <SelectValue placeholder="Select tier" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem className="text-white" value="free">Free - Everyone</SelectItem>
                  <SelectItem className="text-white" value="pro">Pro - Pro & Ultra members</SelectItem>
                  <SelectItem className="text-white" value="ultra">Ultra - Ultra members only</SelectItem>
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
