import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";

import { trackEvent } from "@/services/analytics-service";
import { Link, useRouter } from "@tanstack/react-router";
import { useLingui } from '@lingui/react/macro';

export function LoginForm() {
    const router = useRouter();
    const { toast } = useToast();
    const [showPassword, setShowPassword] = useState(false);
    const { t } = useLingui();

    const formSchema = z.object({
        email: z.string().email({ message: t`Please enter a valid email.` }),
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
            trackEvent("login", { method: "email" });
            router.navigate({ to: "/dashboard" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t`Login Error`,
                description: error.message,
            });
        }
    }

    const handleGoogleSignIn = async () => {
        const provider = new GoogleAuthProvider();
        try {
            await signInWithPopup(auth, provider);
            trackEvent("login", { method: "google" });
            router.navigate({ to: "/dashboard" });
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t`Error with Google Sign-In`,
                description: error.message,
            });
        }
    };

    const { isValid, isSubmitting } = form.formState;

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-2xl font-headline">{t`Welcome Back!`}</CardTitle>
                <CardDescription>{t`Enter your credentials to access your account.`}</CardDescription>
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
                                        <FormLabel>{t`Email`}</FormLabel>
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
                                            <FormLabel>{t`Password`}</FormLabel>
                                            <Link to="/forgot-password">
                                                <Button variant="link" className="px-0 h-auto text-sm">
                                                    {t`Forgot password?`}
                                                </Button>
                                            </Link>
                                        </div>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type={showPassword ? "text" : "password"}
                                                    placeholder="••••••••"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <FontAwesomeIcon
                                                        icon={faEyeSlash}
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                ) : (
                                                    <FontAwesomeIcon
                                                        icon={faEye}
                                                        className="h-4 w-4"
                                                        aria-hidden="true"
                                                    />
                                                )}
                                                <span className="sr-only">
                                                    {showPassword ? t`Hide password` : t`Show password`}
                                                </span>
                                            </Button>
                                        </div>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <Button type="submit" className="w-full" disabled={!isValid || isSubmitting}>
                            {t`Login`}
                        </Button>
                        <div className="relative">
                            <Separator />
                            <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">
                                {t`or`}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                                {t`Sign in with Google`}
                            </Button>
                            <Button variant="outline" className="w-full" type="button">
                                <FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
                                {t`Sign in with Apple`}
                            </Button>
                        </div>
                    </CardContent>
                    <CardFooter className="flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                            {t`Don't have an account?`}{" "}
                            <Link to="/signup">
                                <Button variant="link" className="px-0 h-auto">
                                    {t`Create Account`}
                                </Button>
                            </Link>
                        </p>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
