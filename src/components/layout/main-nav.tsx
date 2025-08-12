
"use client"

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { Logo } from "../icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn, faCog, faFileLines, faGears, faHistory, faHome, faList, faMessage, faMicroscope, faQrcode, faShieldCheck, faShieldHalved, faShoppingBasket, faUsers } from "@fortawesome/free-solid-svg-icons";

const menuItems = [
    { href: "/dashboard", label: "Insights", icon: faHome },
    { href: "/list", label: "Lista de Compras", icon: faList },
    { href: "/scan", label: "Escanear Cupom", icon: faQrcode },
    { href: "/history", label: "Histórico", icon: faHistory },
    { href: "/settings", label: "Configurações", icon: faGears },
];

const adminMenuItems = [
    { href: "/admin", label: "Dashboard", icon: faShieldHalved },
    { href: "/admin/users", label: "Gerenciar Usuários", icon: faUsers },
    { href: "/admin/reports", label: "Relatórios de Uso", icon: faChartColumn },
    { href: "/admin/market-insights", label: "Insights de Mercado", icon: faShoppingBasket },
    { href: "/admin/settings", label: "Configurações Globais", icon: faCog },
    { href: "/admin/notifications", label: "Gerenciar Notificações", icon: faMessage },
    { href: "/admin/audit", label: "Auditoria e Testes", icon: faMicroscope },
    { href: "/admin/security", label: "Segurança", icon: faShieldCheck },
    { href: "/admin/logs", label: "Logs do Sistema", icon: faFileLines },
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

  const isActive = (href: string) => {
    if (href === '/admin') {
        return pathname === href;
    }
    return pathname.startsWith(href) && href !== '/';
  }

  return (
    <>
      <SidebarHeader>
        <ShopWiseLogo />
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
                  <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
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
                        <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
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
