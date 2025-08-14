
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
import { auth, db } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { faApple, faGoogle } from "@fortawesome/free-brands-svg-icons";
import { doc, setDoc, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/services/analytics-service";

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);

  const formSchema = z.object({
    name: z.string().min(2, { message: t('error_name_min_length') }),
    email: z.string().email({ message: t('error_invalid_email') }),
    password: z.string().min(6, { message: t('error_password_min_length') }),
  });


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    mode: "onChange",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      // 1. Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      const user = userCredential.user;
      
      if (user) {
        // 2. Update Auth profile
        await updateProfile(user, { displayName: values.name });

        // 3. Create a new family for the user
        const familyRef = await addDoc(collection(db, Collections.Families), {
            familyName: `Família de ${values.name}`,
            createdAt: serverTimestamp(),
            ownerId: user.uid,
        });

        // 4. Create the user document in Firestore
        const userRef = doc(db, Collections.Users, user.uid);
        await setDoc(userRef, {
            displayName: values.name,
            email: values.email,
            familyId: familyRef.id,
            isAdmin: true, // The user who creates the family is an admin
            settings: {
                theme: "system",
                notifications: true,
            }
        });
        trackEvent('sign_up', { method: 'email' });
        router.push('/dashboard');
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: t('signup_error_title'),
        description: error.message,
      });
    }
  }

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        
        // TODO: Check if user already exists in Firestore before creating new family
        
        const familyRef = await addDoc(collection(db, Collections.Families), {
            familyName: `Família de ${user.displayName}`,
            createdAt: serverTimestamp(),
            ownerId: user.uid,
        });

        const userRef = doc(db, Collections.Users, user.uid);
        await setDoc(userRef, {
            displayName: user.displayName,
            email: user.email,
            familyId: familyRef.id,
            isAdmin: true,
            settings: {
                theme: "system",
                notifications: true,
            }
        }, { merge: true }); // Merge to avoid overwriting existing data if they sign up differently before
        trackEvent('sign_up', { method: 'google' });
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
        <CardTitle className="text-2xl font-headline">{t('signup_title')}</CardTitle>
        <CardDescription>
          {t('signup_description')}
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
             <div className="space-y-2">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>{t('name_label')}</FormLabel>
                        <FormControl>
                        <Input placeholder={t('name_placeholder')} {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
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
                        <FormLabel>{t('password_label')}</FormLabel>
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
              {t('create_account')}
            </Button>
             <div className="relative">
              <Separator />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">{t('or_upper')}</p>
            </div>
            <div className="space-y-2">
                 <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                    {t('signup_with_google')}
                </Button>
                <Button variant="outline" className="w-full" type="button">
                    <FontAwesomeIcon icon={faApple} className="mr-2 h-4 w-4" />
                    {t('signup_with_apple')}
                </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              {t('already_have_account')}{" "}
              <Link href="/login" passHref>
                <Button variant="link" className="px-0 h-auto">{t('login')}</Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
