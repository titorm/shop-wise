
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Separator } from "../ui/separator";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useTranslation } from "react-i18next";

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  const formSchema = z.object({
    email: z.string().email({ message: t("error_invalid_email") }),
    password: z.string().min(6, { message: t("error_password_min_length") }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await signInWithEmailAndPassword(auth, values.email, values.password);
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t("error_login"),
        description: error.message,
      });
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        await signInWithPopup(auth, provider);
        router.push('/dashboard');
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: t("error_google_login"),
            description: error.message,
        });
    }
  }
  
  const { isValid, isSubmitting } = form.formState;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">{t('login_title')}</CardTitle>
        <CardDescription>
          {t('login_description')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('email_label')}</FormLabel>
                    <FormControl>
                      <Input placeholder="seu@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel>{t('password_label')}</FormLabel>
                      <Link href="/forgot-password" passHref>
                        <Button variant="link" className="px-0 h-auto text-sm">
                          {t('forgot_password')}
                        </Button>
                      </Link>
                    </div>
                    <div className="relative">
                      <FormControl>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" {...field} />
                      </FormControl>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FontAwesomeIcon icon={faEyeSlash} className="h-4 w-4" aria-hidden="true" />
                        ) : (
                          <FontAwesomeIcon icon={faEye} className="h-4 w-4" aria-hidden="true" />
                        )}
                        <span className="sr-only">
                          {showPassword ? t('hide_password') : t('show_password')}
                        </span>
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
              {t('login')}
            </Button>
            <div className="relative">
              <Separator />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">{t('or')}</p>
            </div>
            <div className="space-y-2">
                 <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                    {t('sign_in_with_google')}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                    <FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
                    {t('sign_in_with_apple')}
                </Button>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              {t('no_account')}{" "}
              <Link href="/signup" passHref>
                <Button variant="link" className="px-0 h-auto">{t('create_account')}</Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
