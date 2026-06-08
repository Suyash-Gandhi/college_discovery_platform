import { Suspense } from "react";
import LoginForm from "@/components/auth/LoginForm";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Login — CollegeDiscover" };

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="w-8 h-8 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
