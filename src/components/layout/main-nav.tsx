
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, List, QrCode, Settings, Shield, History, Users, BarChart2, ShoppingBasket, MessageSquare, Cog, Microscope, ShieldCheck, FileText } from "lucide-react";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";

const menuItems = [
    { href: "/dashboard", label: "Insights", icon: Home },
    { href: "/list", label: "Lista de Compras", icon: List },
    { href: "/scan", label: "Escanear Cupom", icon: QrCode },
    { href: "/history", label: "Histórico", icon: History },
    { href: "/settings", label: "Configurações", icon: Settings },
];

const adminMenuItems = [
    { href: "/admin", label: "Dashboard", icon: Shield },
    { href: "/admin/users", label: "Gerenciar Usuários", icon: Users },
    { href: "/admin/reports", label: "Relatórios de Uso", icon: BarChart2 },
    { href: "/admin/market-insights", label: "Insights de Mercado", icon: ShoppingBasket },
    { href: "/admin/settings", label: "Configurações Globais", icon: Cog },
    { href: "/admin/notifications", label: "Gerenciar Notificações", icon: MessageSquare },
    { href: "/admin/audit", label: "Auditoria e Testes", icon: Microscope },
    { href: "/admin/security", label: "Segurança", icon: ShieldCheck },
    { href: "/admin/logs", label: "Logs do Sistema", icon: FileText },
];

export function MainNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const isAdmin = profile?.isAdmin || false;

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
                  asChild={false}
                >
                  <item.icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          
          {isAdmin && (
            <>
                <SidebarSeparator />
                <p className="px-4 py-2 text-xs font-semibold text-muted-foreground">Admin</p>
                {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton 
                        isActive={pathname.startsWith(item.href)}
                        tooltip={item.label}
                        asChild={false}
                        >
                        <item.icon className="h-6 w-6" />
                        <span>{item.label}</span>
                        </SidebarMenuButton>
                    </Link>
                    </SidebarMenuItem>
                ))}
            </>
          )}

        </SidebarMenu>
      </SidebarContent>
    </>
  );
}
