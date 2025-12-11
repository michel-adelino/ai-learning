"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthForm } from "./AuthForm";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: "login" | "signup";
}

export function AuthModal({ isOpen, onClose, defaultMode = "login" }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "signup">(defaultMode);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  // Prevent scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md p-6 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
          onClick={onClose}
        >
          <X className="w-5 h-5" />
        </Button>

        {/* Header */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {mode === "login" ? "Welcome back" : "Create an account"}
          </h2>
          <p className="text-zinc-400 mt-2">
            {mode === "login"
              ? "Sign in to access your courses"
              : "Get started with your learning journey"}
          </p>
        </div>

        {/* Form */}
        <AuthForm mode={mode} onSuccess={onClose} />

        {/* Toggle mode */}
        <div className="mt-6 text-center text-sm">
          <span className="text-zinc-400">
            {mode === "login" ? "Don't have an account?" : "Already have an account?"}
          </span>{" "}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-violet-400 hover:text-violet-300 font-medium"
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
