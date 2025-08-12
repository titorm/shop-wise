
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
import { Separator } from "../ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { updateProfile, linkWithPopup, GoogleAuthProvider, OAuthProvider, User, AuthProvider } from "firebase/auth";
import { auth, db, googleProvider } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";
import { doc, setDoc } from "firebase/firestore";
import { Collections } from "@/lib/enums";

const profileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Senha atual é obrigatória." }),
  newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
});

export function ProfileForm() {
  const { user, reloadUser } = useAuth();
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [linkedProviders, setLinkedProviders] = useState<string[]>([]);

  useEffect(() => {
    if (user) {
        profileForm.reset({
            name: user.displayName ?? "",
            email: user.email ?? "",
        });
        const providers = user.providerData.map(p => p.providerId);
        setLinkedProviders(providers);
    }
  }, [user]);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
    mode: "onChange",
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
    },
    mode: "onChange",
  });


  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    if (!auth.currentUser) return;
    try {
        await updateProfile(auth.currentUser, { displayName: values.name });

        // Save user data to Firestore
        const userRef = doc(db, Collections.Profile, auth.currentUser.uid);
        await setDoc(userRef, {
            display_name: values.name,
            email: auth.currentUser.email, // email is not editable, so we get it from auth
        }, { merge: true });


        await reloadUser();
        profileForm.reset(values); // Resets the dirty state
        toast({
            title: "Sucesso!",
            description: "Seu perfil foi atualizado.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro ao atualizar perfil",
            description: error.message,
        });
    }
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    console.log("Password change requested:", values);
    // Here you would implement password change logic with Firebase Auth
    passwordForm.reset(); // Resets the form after submission
  }

  const handleLinkAccount = async (provider: AuthProvider) => {
    if (!auth.currentUser) return;
    try {
        await linkWithPopup(auth.currentUser, provider);
        await reloadUser();
        toast({
            title: "Conta Conectada!",
            description: "Sua conta foi conectada com sucesso.",
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: "Erro ao conectar conta",
            description: error.message,
        });
    }
  }

  const { isDirty: isProfileDirty, isValid: isProfileValid, isSubmitting: isProfileSubmitting } = profileForm.formState;
  const { isDirty: isPasswordDirty, isValid: isPasswordValid, isSubmitting: isPasswordSubmitting } = passwordForm.formState;


  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Informações do Perfil</CardTitle>
          <CardDescription>Atualize seu nome e email.</CardDescription>
        </CardHeader>
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={profileForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} disabled />
                    </FormControl>
                     <p className="text-xs text-muted-foreground">O email não pode ser alterado.</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isProfileDirty || !isProfileValid || isProfileSubmitting}>
                Salvar Alterações
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      
       <Card>
        <CardHeader>
          <CardTitle>Contas Conectadas</CardTitle>
          <CardDescription>Conecte suas contas sociais para facilitar o login.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                    <svg className="h-6 w-6" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.657-3.298-11.303-8H6.306C9.656 39.663 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.338 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    <span>Google</span>
                </div>
                <Button 
                    variant="outline"
                    disabled={linkedProviders.includes("google.com")}
                    onClick={() => handleLinkAccount(googleProvider)}
                >
                    {linkedProviders.includes("google.com") ? "Conectado" : "Conectar"}
                </Button>
            </div>
             <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                    <svg className="h-6 w-6" viewBox="0 0 24 24"><path fill="currentColor" d="M17.34 16.86c-1.16 1.03-2.64 1.6-4.2 1.6c-1.76 0-3.37-.68-4.59-1.9c-1.22-1.21-1.89-2.83-1.89-4.58c0-1.79.69-3.43 1.94-4.66c1.25-1.23 2.92-1.89 4.67-1.89c1.45 0 2.8.49 3.89 1.48l-1.63 1.56c-.7-.69-1.63-1.07-2.6-1.07c-1.12 0-2.14.44-2.88 1.18c-.74.74-1.15 1.74-1.15 2.79s.41 2.05 1.15 2.79c.74.74 1.76 1.18 2.88 1.18c1.07 0 1.91-.39 2.54-1.1l1.63 1.56zM20.92 11.12c0-.12 0-.23-.02-.34c-.04-.2-.08-.39-.14-.58c-.06-.2-.13-.39-.22-.58c-.09-.19-.2-.37-.31-.54c-.11-.17-.24-.33-.37-.48c-.14-.15-.28-.29-.44-.42c-.16-.13-.33-.25-.5-.36c-.18-.11-.36-.21-.56-.29c-.2-.08-.4-.15-.62-.21c-.22-.06-.44-.1-.67-.13c-.23-.03-.46-.05-.7-.05h-2.14v3.5h1.79c.25 0 .49-.02.72-.05c.23-.03.46-.08.67-.14c.22-.06.42-.14.61-.24c.19-.1.37-.22.53-.35c.16-.13.31-.28.45-.45c.14-.17.26-.35.36-.55c.1-.2.18-.41.25-.63c.07-.22.12-.44.15-.67c.03-.23.05-.46.05-.7v-.01zM12.01 22C6.49 22 2 17.51 2 12S6.49 2 12.01 2C17.53 2 22 6.49 22 12s-4.47 10-9.99 10z"/></svg>
                    <span>Apple</span>
                </div>
                <Button 
                    variant="outline"
                    disabled={linkedProviders.includes("apple.com")}
                    onClick={() => handleLinkAccount(new OAuthProvider('apple.com'))}
                >
                    {linkedProviders.includes("apple.com") ? "Conectado" : "Conectar"}
                </Button>
            </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Alterar Senha</CardTitle>
          <CardDescription>Escolha uma nova senha forte.</CardDescription>
        </CardHeader>
        <Form {...passwordForm}>
          <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
            <CardContent className="space-y-4">
               <FormField
                control={passwordForm.control}
                name="currentPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Senha Atual</FormLabel>
                    <div className="relative">
                        <FormControl>
                          <Input type={showCurrentPassword ? "text" : "password"} {...field} />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                            {showCurrentPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                                {showCurrentPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={passwordForm.control}
                name="newPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nova Senha</FormLabel>
                     <div className="relative">
                        <FormControl>
                            <Input type={showNewPassword ? "text" : "password"} {...field} />
                        </FormControl>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute top-0 right-0 h-full px-3 py-2 hover:bg-transparent"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                            {showNewPassword ? (
                                <EyeOff className="h-4 w-4" aria-hidden="true" />
                            ) : (
                                <Eye className="h-4 w-4" aria-hidden="true" />
                            )}
                            <span className="sr-only">
                                {showNewPassword ? "Hide password" : "Show password"}
                            </span>
                        </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={!isPasswordDirty || !isPasswordValid || isPasswordSubmitting}>
                Alterar Senha
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
