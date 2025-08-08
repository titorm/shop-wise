"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, Home, List, QrCode, Settings, User } from "lucide-react";
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

const menuItems = [
    { href: "/dashboard", label: "Insights", icon: Home },
    { href: "/list", label: "Lista de Compras", icon: List },
    { href: "/scan", label: "Escanear Cupom", icon: QrCode },
    { href: "/settings", label: "Configurações", icon: Settings },
];


export function MainNav() {
  const pathname = usePathname();

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
              <Link href={item.href} legacyBehavior passHref>
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
          <Link href="/settings" legacyBehavior passHref>
            <SidebarMenuButton>
                <Avatar className="h-8 w-8">
                    <AvatarImage src="https://placehold.co/100x100.png" alt="User Avatar" data-ai-hint="user avatar" />
                    <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="truncate">Usuário</span>
            </SidebarMenuButton>
          </Link>
        </div>
      </SidebarFooter>
    </>
  );
}
