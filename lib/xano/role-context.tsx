"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useAuth } from "@/lib/xano/auth-context";
import type { Role } from "@/lib/xano/types";

interface RoleContextType {
  role: Role | null;
  isTeacher: boolean;
  isStudent: boolean;
  isAdmin: boolean;
  canUpload: boolean;
  canCreateCourses: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  const role = user?.role ?? null;
  const isTeacher = role === "teacher";
  const isStudent = role === "student";
  const isAdmin = role === "admin";
  const canUpload = isTeacher || isAdmin;
  const canCreateCourses = isTeacher || isAdmin;

  return (
    <RoleContext.Provider
      value={{
        role,
        isTeacher,
        isStudent,
        isAdmin,
        canUpload,
        canCreateCourses,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}

// Higher-order component for teacher-only routes
export function withTeacherOnly<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function TeacherOnlyComponent(props: P) {
    const { canCreateCourses } = useRole();
    
    if (!canCreateCourses) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-white mb-2">Access Denied</h2>
            <p className="text-zinc-400">Only teachers can access this page.</p>
          </div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };
}
