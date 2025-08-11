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
import { updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Eye, EyeOff } from "lucide-react";

const profileSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Email inválido." }),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: "Senha atual é obrigatória." }),
  newPassword: z.string().min(6, { message: "A nova senha deve ter pelo menos 6 caracteres." }),
});

export function ProfileForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
        currentPassword: "",
        newPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
        profileForm.reset({
            name: user.displayName ?? "",
            email: user.email ?? "",
        });
    }
  }, [user, profileForm]);


  async function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    if (!auth.currentUser) return;
    try {
        await updateProfile(auth.currentUser, { displayName: values.name });
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
  }

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
              <Button type="submit">Salvar Alterações</Button>
            </CardFooter>
          </form>
        </Form>
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
              <Button type="submit">Alterar Senha</Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
}
