"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/xano/auth-context";
import { Loader2, GraduationCap, BookOpen } from "lucide-react";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
  redirectTo?: string;
}

export function AuthForm({ mode, onSuccess, redirectTo = "/dashboard" }: AuthFormProps) {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student" as "student" | "teacher",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await login(formData.email, formData.password);
      } else {
        await signup(
          formData.email,
          formData.password,
          formData.firstName,
          formData.lastName,
          formData.role
        );
      }

      // Set cookie for server-side auth
      document.cookie = `xano_auth_token=${localStorage.getItem("xano_auth_token")}; path=/; max-age=${60 * 60 * 24 * 7}`;

      onSuccess?.();
      
      // Redirect teachers to teacher dashboard
      const redirectPath = formData.role === "teacher" && mode === "signup" ? "/teacher" : redirectTo;
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      {mode === "signup" && (
        <>
          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-zinc-200 font-medium">I want to...</Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) =>
                setFormData({ ...formData, role: value as "student" | "teacher" })
              }
              className="grid grid-cols-2 gap-4"
            >
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "student"
                    ? "border-violet-500 bg-violet-500/15 ring-1 ring-violet-500/30"
                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                }`}
              >
                <RadioGroupItem value="student" id="student" className="sr-only" />
                <BookOpen className={`w-5 h-5 ${formData.role === "student" ? "text-violet-400" : "text-zinc-400"}`} />
                <div>
                  <p className={`font-medium ${formData.role === "student" ? "text-white" : "text-zinc-300"}`}>
                    Learn
                  </p>
                  <p className={`text-xs ${formData.role === "student" ? "text-violet-300/70" : "text-zinc-400"}`}>Take courses</p>
                </div>
              </label>
              <label
                className={`flex items-center gap-3 p-4 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "teacher"
                    ? "border-amber-500 bg-amber-500/15 ring-1 ring-amber-500/30"
                    : "border-zinc-700 hover:border-zinc-600 bg-zinc-900/50"
                }`}
              >
                <RadioGroupItem value="teacher" id="teacher" className="sr-only" />
                <GraduationCap className={`w-5 h-5 ${formData.role === "teacher" ? "text-amber-400" : "text-zinc-400"}`} />
                <div>
                  <p className={`font-medium ${formData.role === "teacher" ? "text-white" : "text-zinc-300"}`}>
                    Teach
                  </p>
                  <p className={`text-xs ${formData.role === "teacher" ? "text-amber-300/70" : "text-zinc-400"}`}>Create courses</p>
                </div>
              </label>
            </RadioGroup>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-zinc-200 font-medium">
                First Name
              </Label>
              <Input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) =>
                  setFormData({ ...formData, firstName: e.target.value })
                }
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
                placeholder="John"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-zinc-200 font-medium">
                Last Name
              </Label>
              <Input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) =>
                  setFormData({ ...formData, lastName: e.target.value })
                }
                className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
                placeholder="Doe"
              />
            </div>
          </div>
        </>
      )}

      <div className="space-y-2">
        <Label htmlFor="email" className="text-zinc-200 font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
          placeholder="john@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-zinc-200 font-medium">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          value={formData.password}
          onChange={(e) =>
            setFormData({ ...formData, password: e.target.value })
          }
          className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-violet-500 focus:ring-violet-500/20"
          placeholder="••••••••"
          required
          minLength={6}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-violet-600 hover:bg-violet-700 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            {mode === "login" ? "Signing in..." : "Creating account..."}
          </>
        ) : mode === "login" ? (
          "Sign In"
        ) : (
          "Create Account"
        )}
      </Button>
    </form>
  );
}
