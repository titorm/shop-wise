"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, List, QrCode, Settings } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";

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
    </>
  );
}
