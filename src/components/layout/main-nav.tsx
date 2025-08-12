
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
  SidebarCollapseButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Logo } from "../icons";

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

function ShopWiseLogo() {
  const { state } = useSidebar();
  return (
      <div className="flex items-center gap-2">
          <div className={cn(
              "p-1.5 rounded-lg transition-colors duration-300",
              state === 'expanded' && 'bg-primary/20'
            )}>
              <Logo className="w-5 h-5 text-primary" />
          </div>
          <span className={cn("text-lg font-bold font-headline transition-opacity duration-300", state === 'collapsed' && 'opacity-0')}>
            ShopWise
          </span>
      </div>
  )
}

export function MainNav() {
  const pathname = usePathname();
  const { profile } = useAuth();
  const isAdmin = profile?.isAdmin || false;
  const { state } = useSidebar();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
            <ShopWiseLogo />
            <SidebarCollapseButton />
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
                  <item.icon className="h-5 w-5" />
                  <span className={cn(state === 'collapsed' && 'hidden')}>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
          
          {isAdmin && (
            <>
                <p className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300", state === 'collapsed' ? 'opacity-0 h-0' : 'opacity-100 h-auto')}>Workspace</p>
                {adminMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                    <Link href={item.href}>
                        <SidebarMenuButton 
                        isActive={pathname === item.href}
                        tooltip={item.label}
                        asChild={false}
                        >
                        <item.icon className="h-5 w-5" />
                        <span className={cn(state === 'collapsed' && 'hidden')}>{item.label}</span>
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
