
"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ShopWiseIcon } from "@/components/icons";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8">
            <ShopWiseIcon className="w-16 h-16 text-primary" />
        </Link>
        <LoginForm />
      </div>
    </div>
  );
}
