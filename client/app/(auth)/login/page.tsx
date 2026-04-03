
import type { Metadata } from "next";
import { Suspense } from "react";

import Loading from "@/components/common/Loading";
import LoginForm from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in — TaskApp",
};

export default function LoginPage() {
  return (
    <Suspense fallback={<Loading />}>
      <LoginForm />
    </Suspense>
  );
}