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
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, { message: "O nome deve ter pelo menos 2 caracteres." }),
  email: z.string().email({ message: "Por favor, insira um email válido." }),
  password: z.string().min(6, { message: "A senha deve ter pelo menos 6 caracteres." }),
});

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, values.email, values.password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: values.name });
      }
      router.push('/dashboard');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Erro ao criar conta",
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
            title: "Erro de Login com Google",
            description: error.message,
        });
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline">Crie sua conta</CardTitle>
        <CardDescription>
          É rápido e fácil. Comece a economizar hoje mesmo!
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
                        <FormLabel>Nome</FormLabel>
                        <FormControl>
                        <Input placeholder="Seu nome" {...field} />
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
                        <FormLabel>Email</FormLabel>
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
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                        <Input type="password" placeholder="••••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
            </div>
            <Button type="submit" className="w-full">
              Criar Conta
            </Button>
             <div className="relative">
              <Separator />
              <p className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-sm text-muted-foreground">OU</p>
            </div>
            <div className="space-y-2">
                 <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"></path><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z"></path><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.222 0-9.657-3.298-11.303-8H6.306C9.656 39.663 16.318 44 24 44z"></path><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.012 35.853 44 30.338 44 24c0-1.341-.138-2.65-.389-3.917z"></path></svg>
                    Criar com Google
                </Button>
                <Button variant="outline" className="w-full" type="button">
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M17.34 16.86c-1.16 1.03-2.64 1.6-4.2 1.6c-1.76 0-3.37-.68-4.59-1.9c-1.22-1.21-1.89-2.83-1.89-4.58c0-1.79.69-3.43 1.94-4.66c1.25-1.23 2.92-1.89 4.67-1.89c1.45 0 2.8.49 3.89 1.48l-1.63 1.56c-.7-.69-1.63-1.07-2.6-1.07c-1.12 0-2.14.44-2.88 1.18c-.74.74-1.15 1.74-1.15 2.79s.41 2.05 1.15 2.79c.74.74 1.76 1.18 2.88 1.18c1.07 0 1.91-.39 2.54-1.1l1.63 1.56zM20.92 11.12c0-.12 0-.23-.02-.34c-.04-.2-.08-.39-.14-.58c-.06-.2-.13-.39-.22-.58c-.09-.19-.2-.37-.31-.54c-.11-.17-.24-.33-.37-.48c-.14-.15-.28-.29-.44-.42c-.16-.13-.33-.25-.5-.36c-.18-.11-.36-.21-.56-.29c-.2-.08-.4-.15-.62-.21c-.22-.06-.44-.1-.67-.13c-.23-.03-.46-.05-.7-.05h-2.14v3.5h1.79c.25 0 .49-.02.72-.05c.23-.03.46-.08.67-.14c.22-.06.42-.14.61-.24c.19-.1.37-.22.53-.35c.16-.13.31-.28.45-.45c.14-.17.26-.35.36-.55c.1-.2.18-.41.25-.63c.07-.22.12-.44.15-.67c.03-.23.05-.46.05-.7v-.01zM12.01 22C6.49 22 2 17.51 2 12S6.49 2 12.01 2C17.53 2 22 6.49 22 12s-4.47 10-9.99 10z"/></svg>
                    Criar com Apple
                </Button>
            </div>
          </CardContent>
          <CardFooter>
            <p className="text-sm text-muted-foreground">
              Já tem uma conta?{" "}
              <Link href="/login" passHref>
                <Button variant="link" className="px-0 h-auto">Entrar</Button>
              </Link>
            </p>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
