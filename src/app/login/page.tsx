
"use client";

import Link from "next/link";
import { LoginForm } from "@/components/auth/login-form";
import { ShopWiseIcon } from "@/components/icons";
import { useTranslation } from "react-i18next";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoginPage() {
    const { ready } = useTranslation();

    if (!ready) {
        return (
             <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <div className="w-full max-w-md space-y-8">
                    <Skeleton className="h-16 w-16 mx-auto" />
                    <Skeleton className="h-96 w-full" />
                </div>
            </div>
        )
    }

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
