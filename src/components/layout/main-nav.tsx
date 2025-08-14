
"use client"

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartColumn, faCog, faHistory, faHome, faList, faMicroscope, faPlusCircle, faShield, faShieldHalved, faShoppingBasket, faUsers, faSignOutAlt, faUser, faUserGroup } from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faMessage } from "@fortawesome/free-regular-svg-icons";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useTranslation } from "react-i18next";
import { ShopWiseLogo } from "../icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import { Button } from "../ui/button";

const menuItems = [
    { href: "/dashboard", label: "insights", icon: faHome },
    { href: "/list", label: "shopping_list", icon: faList },
    { href: "/scan", label: "add_purchase", icon: faPlusCircle },
    { href: "/history", label: "history", icon: faHistory },
];

const settingsMenuItems = [
    { href: "/family", label: "family", icon: faUserGroup },
    { href: "/settings", label: "my_account", icon: faUser },
]

const adminMenuItems = [
    { href: "/admin", label: "dashboard", icon: faShieldHalved },
    { href: "/admin/users", label: "manage_users", icon: faUsers },
    { href: "/admin/reports", label: "usage_reports", icon: faChartColumn },
    { href: "/admin/market-insights", label: "market_insights", icon: faShoppingBasket },
    { href: "/admin/settings", label: "global_settings", icon: faCog },
    { href: "/admin/notifications", label: "manage_notifications", icon: faMessage },
    { href: "/admin/audit", label: "audit_and_tests", icon: faMicroscope },
    { href: "/admin/security", label: "security", icon: faShield },
    { href: "/admin/logs", label: "system_logs", icon: faFileLines },
];


export function MainNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();
  const { t } = useTranslation();
  const isAdmin = profile?.isAdmin || false;
  const { state } = useSidebar();
  
  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  }


  const isActive = (href: string) => {
    if (href === '/admin' || href === '/dashboard') {
        return pathname === href;
    }
    return pathname.startsWith(href);
  }

  return (
    <SidebarContent>
      <SidebarMenu>
        {menuItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href}>
              <SidebarMenuButton 
                isActive={isActive(item.href)}
                tooltip={t(item.label)}
                asChild={false}
              >
                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                <span className={cn("transition-all duration-300 ease-in-out", state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100')}>{t(item.label)}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarMenu className="mt-auto">
          <p className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300", state === 'collapsed' ? 'opacity-0 h-0' : 'opacity-100 h-auto')}>{t('settings_section_title')}</p>
          {settingsMenuItems.map((item) => (
              <SidebarMenuItem key={item.href}>
              <Link href={item.href}>
                  <SidebarMenuButton 
                  isActive={isActive(item.href)}
                  tooltip={t(item.label)}
                  asChild={false}
                  >
                  <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                  <span className={cn("transition-all duration-300 ease-in-out", state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100')}>{t(item.label)}</span>
                  </SidebarMenuButton>
              </Link>
              </SidebarMenuItem>
          ))}
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <SidebarMenuItem>
                        <SidebarMenuButton 
                            tooltip={t('logout')}
                            asChild={false}
                        >
                            <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                            <span className={cn("transition-all duration-300 ease-in-out", state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100')}>{t('logout')}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>{t('logout_confirm_title')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        {t('logout_confirm_desc')}
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>{t('cancel')}</AlertDialogCancel>
                    <AlertDialogAction asChild>
                         <Button onClick={handleSignOut}>{t('logout_confirm_button')}</Button>
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
          
          {isAdmin && (
              <>
                  <p className={cn("px-4 py-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300", state === 'collapsed' ? 'opacity-0 h-0' : 'opacity-100 h-auto')}>{t('admin_section_title')}</p>
                  {adminMenuItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                      <Link href={item.href}>
                          <SidebarMenuButton 
                          isActive={isActive(item.href)}
                          tooltip={t(item.label)}
                          asChild={false}
                          >
                          <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                          <span className={cn("transition-all duration-300 ease-in-out", state === 'collapsed' ? 'opacity-0 w-0' : 'opacity-100')}>{t(item.label)}</span>
                          </SidebarMenuButton>
                      </Link>
                      </SidebarMenuItem>
                  ))}
              </>
          )}

      </SidebarMenu>
    </SidebarContent>
  );
}
