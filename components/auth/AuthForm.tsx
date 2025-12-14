"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/lib/xano/auth-context";
import {
  Loader2,
  GraduationCap,
  BookOpen,
  Mail,
  Lock,
  User,
} from "lucide-react";
import { motion } from "framer-motion";

interface AuthFormProps {
  mode: "login" | "signup";
  onSuccess?: () => void;
  redirectTo?: string;
}

export function AuthForm({
  mode,
  onSuccess,
  redirectTo = "/dashboard",
}: AuthFormProps) {
  const { login, signup } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    role: "student" as "student" | "teacher",
  });

  // Validation functions
  const validateEmail = (email: string): string | null => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, and one number";
    }
    return null;
  };

  const validateName = (name: string, fieldName: string): string | null => {
    if (!name.trim()) return `${fieldName} is required`;
    if (name.trim().length < 2)
      return `${fieldName} must be at least 2 characters long`;
    if (!/^[a-zA-Z\s-']+$/.test(name.trim()))
      return `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`;
    return null;
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Email validation
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) errors.password = passwordError;

    // Name validation for signup
    if (mode === "signup") {
      const firstNameError = validateName(formData.firstName, "First name");
      if (firstNameError) errors.firstName = firstNameError;

      const lastNameError = validateName(formData.lastName, "Last name");
      if (lastNameError) errors.lastName = lastNameError;
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setFieldErrors({});

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

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

      document.cookie = `xano_auth_token=${localStorage.getItem(
        "xano_auth_token"
      )}; path=/; max-age=${60 * 60 * 24 * 7}`;

      onSuccess?.();

      const redirectPath =
        formData.role === "teacher" && mode === "signup"
          ? "/teacher"
          : redirectTo;
      router.push(redirectPath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-3 rounded-xl glass border border-red-500/20 text-red-400 text-sm"
        >
          {error}
        </motion.div>
      )}

      {mode === "signup" && (
        <>
          {/* Role Selection - Compact */}
          <div className="space-y-1.5">
            <Label className="text-foreground font-medium text-xs">
              I want to...
            </Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  role: value as "student" | "teacher",
                })
              }
              className="grid grid-cols-2 gap-2"
            >
              <motion.label
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "student"
                    ? "border-emerald-500/40 glass ring-1 ring-emerald-500/30"
                    : "border-white/10 hover:border-white/20 glass-subtle"
                }`}
              >
                <RadioGroupItem
                  value="student"
                  id="student"
                  className="sr-only"
                />
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    formData.role === "student"
                      ? "bg-emerald-500/20"
                      : "glass-subtle"
                  }`}
                >
                  <BookOpen
                    className={`w-3.5 h-3.5 ${
                      formData.role === "student"
                        ? "text-emerald-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <p
                  className={`font-medium text-sm ${
                    formData.role === "student"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Learn
                </p>
              </motion.label>
              <motion.label
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 p-2.5 rounded-xl border cursor-pointer transition-all ${
                  formData.role === "teacher"
                    ? "border-amber-500/50 glass ring-1 ring-amber-500/30"
                    : "border-white/10 hover:border-white/20 glass-subtle"
                }`}
              >
                <RadioGroupItem
                  value="teacher"
                  id="teacher"
                  className="sr-only"
                />
                <div
                  className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                    formData.role === "teacher"
                      ? "bg-amber-500/20"
                      : "glass-subtle"
                  }`}
                >
                  <GraduationCap
                    className={`w-3.5 h-3.5 ${
                      formData.role === "teacher"
                        ? "text-amber-400"
                        : "text-muted-foreground"
                    }`}
                  />
                </div>
                <p
                  className={`font-medium text-sm ${
                    formData.role === "teacher"
                      ? "text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  Teach
                </p>
              </motion.label>
            </RadioGroup>
          </div>

          {/* Name fields - compact */}
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label
                htmlFor="firstName"
                className="text-muted-foreground font-medium text-xs"
              >
                First Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData({ ...formData, firstName: e.target.value })
                  }
                  className={`pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm ${
                    fieldErrors.firstName
                      ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="John"
                  maxLength={50}
                  required
                />
              </div>
              {fieldErrors.firstName && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.firstName}
                </p>
              )}
            </div>
            <div className="space-y-1">
              <Label
                htmlFor="lastName"
                className="text-muted-foreground font-medium text-xs"
              >
                Last Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <Input
                  id="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  className={`pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm ${
                    fieldErrors.lastName
                      ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                      : ""
                  }`}
                  placeholder="Doe"
                  maxLength={50}
                  required
                />
              </div>
              {fieldErrors.lastName && (
                <p className="text-red-400 text-xs mt-1">
                  {fieldErrors.lastName}
                </p>
              )}
            </div>
          </div>
        </>
      )}

      <div className="space-y-1">
        <Label
          htmlFor="email"
          className="text-muted-foreground font-medium text-xs"
        >
          Email
        </Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className={`pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm ${
              fieldErrors.email
                ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                : ""
            }`}
            placeholder="john@example.com"
            maxLength={254}
            required
          />
        </div>
        {fieldErrors.email && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.email}</p>
        )}
      </div>

      <div className="space-y-1">
        <Label
          htmlFor="password"
          className="text-muted-foreground font-medium text-xs"
        >
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
            className={`pl-9 glass border-white/10 text-foreground placeholder:text-muted-foreground focus:border-emerald-500/40 focus:ring-emerald-500/20 rounded-xl h-9 text-sm ${
              fieldErrors.password
                ? "border-red-500/40 focus:border-red-500/40 focus:ring-red-500/20"
                : ""
            }`}
            placeholder="••••••••"
            required
            minLength={6}
            maxLength={128}
          />
        </div>
        {fieldErrors.password && (
          <p className="text-red-400 text-xs mt-1">{fieldErrors.password}</p>
        )}
      </div>

      <motion.div
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="pt-1"
      >
        <Button
          type="submit"
          className="w-full h-9 btn-shiny bg-emerald-500 hover:bg-emerald-400 text-background font-semibold rounded-xl glow-emerald transition-all text-sm"
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
      </motion.div>
    </motion.form>
  );
}
