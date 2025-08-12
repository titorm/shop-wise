
"use client";

import Link from "next/link";
import { Bell, LogOut, ShoppingCart, User, Users, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials, cn } from "@/lib/utils";

export function Header() {
  const { user } = useAuth();
  const { state } = useSidebar();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      <div className={cn(
        "items-center gap-2 md:flex",
        state === 'expanded' ? 'md:hidden' : ''
      )}>
        <Logo className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold font-headline hidden md:block">ShopWise</span>
      </div>
      
      <div className="flex items-center gap-2 md:hidden">
        <SidebarTrigger />
      </div>
      
      <div className="flex w-full items-center justify-end gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/list">
            <ShoppingCart className="h-5 w-5" />
            <span>
              <span className="sr-only">Lista de Compras Ativa</span>
            </span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notificações</span>
        </Button>
        {user && (
           <DropdownMenu>
              <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full p-0">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user?.photoURL ?? ""} alt={user?.displayName ?? "User Avatar"} />
                      <AvatarFallback>{getUserInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                  </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                  <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                          <p className="text-sm font-medium leading-none">{user.displayName}</p>
                          <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                      </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <Link href="/settings?tab=profile" passHref>
                    <DropdownMenuItem>
                        <User className="mr-2 h-4 w-4" />
                        <span>Perfil</span>
                    </DropdownMenuItem>
                  </Link>
                   <Link href="/settings?tab=preferences" passHref>
                    <DropdownMenuItem>
                        <Users className="mr-2 h-4 w-4" />
                        <span>Preferências</span>
                    </DropdownMenuItem>
                  </Link>
                  <Link href="/settings?tab=privacy" passHref>
                    <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        <span>Dados e Privacidade</span>
                    </DropdownMenuItem>
                  </Link>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sair</span>
                  </DropdownMenuItem>
              </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
}
