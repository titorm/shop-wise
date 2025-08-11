"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart2, Home, List, QrCode, Settings, User, Shield, LogOut } from "lucide-react";
import {
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/hooks/use-auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";

const menuItems = [
    { href: "/dashboard", label: "Insights", icon: Home },
    { href: "/list", label: "Lista de Compras", icon: List },
    { href: "/scan", label: "Escanear Cupom", icon: QrCode },
    { href: "/settings", label: "Configurações", icon: Settings },
];


export function MainNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
            <Logo className="w-8 h-8 text-primary" />
            <span className="text-lg font-bold font-headline">ShopWise</span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                <SidebarMenuButton 
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarSeparator />
      <SidebarFooter>
        <div className="p-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <SidebarMenuButton>
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.photoURL ?? "https://placehold.co/100x100.png"} alt="User Avatar" data-ai-hint="user avatar" />
                            <AvatarFallback>{user?.displayName?.charAt(0) ?? 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="truncate">{user?.displayName ?? 'Usuário'}</span>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56 mb-2 ml-2" side="top" align="start">
                    <DropdownMenuLabel>
                       Minha Conta
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <Link href="/settings?tab=profile">
                        <DropdownMenuItem>
                            <User className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                    </Link>
                    <Link href="/settings?tab=privacy">
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
        </div>
      </SidebarFooter>
    </>
  );
}
