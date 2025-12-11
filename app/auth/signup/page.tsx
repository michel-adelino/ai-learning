"use client";

import Link from "next/link";
import { Code2, ArrowLeft } from "lucide-react";
import { AuthForm } from "@/components/auth";

export default function SignupPage() {
  return (
    <div className="min-h-screen bg-[#09090b] text-white flex items-center justify-center p-6">
      {/* Background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[700px] h-[700px] bg-violet-600/25 rounded-full blur-[150px] animate-pulse" />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-[30%] right-[15%] w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative w-full max-w-md animate-fade-in-up">
        {/* Back to home */}
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-flex items-center gap-2.5 group">
            <div className="relative">
              <div className="absolute inset-0 bg-linear-to-r from-violet-600 to-fuchsia-600 rounded-xl blur-lg opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-linear-to-r from-violet-600 to-fuchsia-600 p-2.5 rounded-xl shadow-lg shadow-violet-500/25">
                <Code2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <span className="text-2xl font-bold text-gradient">
              Simply Learn
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="glass border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black mb-2">Create your account</h1>
            <p className="text-zinc-400">
              Start your coding journey today
            </p>
          </div>

          <AuthForm mode="signup" redirectTo="/dashboard" />

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-400">Already have an account?</span>{" "}
            <Link
              href="/auth/login"
              className="text-violet-400 hover:text-violet-300 font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
