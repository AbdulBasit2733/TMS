
import RegisterForm from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create account — TaskApp",
};

export default function RegisterPage() {
  return <RegisterForm />;
}