import Link from "next/link";
import { SignupForm } from "@/components/auth/signup-form";
import { ShopWiseIcon } from "@/components/icons";

export default function SignupPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center mb-8">
          <ShopWiseIcon className="w-10 h-10 text-primary" />
        </Link>
        <SignupForm />
      </div>
    </div>
  );
}
