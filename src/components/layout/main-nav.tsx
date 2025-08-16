import { SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLingui } from '@lingui/react/macro';
import {
    faChartColumn,
    faCog,
    faHome,
    faList,
    faMicroscope,
    faPlusCircle,
    faShield,
    faShieldHalved,
    faShoppingBasket,
    faUsers,
    faSignOutAlt,
    faUser,
    faUserGroup,
} from "@fortawesome/free-solid-svg-icons";
import { faFileLines, faMessage } from "@fortawesome/free-regular-svg-icons";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { trackEvent } from "@/services/analytics-service";
import { Link, useRouter } from "@tanstack/react-router";

const menuItems = [
    { href: "/dashboard", label: "insights", icon: faHome },
    { href: "/list", label: "shopping_list", icon: faList },
    { href: "/scan", label: "add_purchase", icon: faPlusCircle },
];

const settingsMenuItems = [
    { href: "/family", label: "family", icon: faUserGroup },
    { href: "/settings", label: "my_account", icon: faUser },
];

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
    const router = useRouter();
    const { profile } = useAuth();
    const { t } = useLingui();
    const isAdmin = profile?.isAdmin || false;
    const { state } = useSidebar();

    const handleSignOut = async () => {
        await signOut(auth);
        trackEvent("user_logged_out");
        router.navigate({ to: "/" });
    };

    const isActive = (href: string) => {
        // if (href === "/admin" || href === "/dashboard") {
        //     return pathname === href;
        // }
        // return pathname.startsWith(href);
        return false;
    };

    return (
        <SidebarContent>
            <SidebarMenu>
                {menuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link to={item.href}>
                            <SidebarMenuButton isActive={isActive(item.href)} tooltip={t(item.label)} asChild={false}>
                                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                                <span
                                    className={cn(
                                        "transition-all duration-300 ease-in-out",
                                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                                    )}
                                >
                                    {t(item.label)}
                                </span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
            <SidebarMenu className="mt-auto">
                <p
                    className={cn(
                        "px-4 py-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300",
                        state === "collapsed" ? "opacity-0 h-0" : "opacity-100 h-auto"
                    )}
                >
                    {t`Configurações`}
                </p>
                {settingsMenuItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                        <Link to={item.href}>
                            <SidebarMenuButton isActive={isActive(item.href)} tooltip={t(item.label)} asChild={false}>
                                <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                                <span
                                    className={cn(
                                        "transition-all duration-300 ease-in-out",
                                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                                    )}
                                >
                                    {t(item.label)}
                                </span>
                            </SidebarMenuButton>
                        </Link>
                    </SidebarMenuItem>
                ))}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <SidebarMenuItem>
                            <SidebarMenuButton tooltip={t`Sair`} asChild={false}>
                                <FontAwesomeIcon icon={faSignOutAlt} className="h-5 w-5" />
                                <span
                                    className={cn(
                                        "transition-all duration-300 ease-in-out",
                                        state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                                    )}
                                >
                                    {t`Sair`}
                                </span>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>{t`Você tem certeza que quer sair?`}</AlertDialogTitle>
                            <AlertDialogDescription>{t`Você será redirecionado para a página inicial.`}</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>{t`Cancelar`}</AlertDialogCancel>
                            <AlertDialogAction asChild>
                                <Button onClick={handleSignOut}>{t`Sim, sair`}</Button>
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {isAdmin && (
                    <>
                        <p
                            className={cn(
                                "px-4 py-2 text-xs font-semibold text-muted-foreground transition-opacity duration-300",
                                state === "collapsed" ? "opacity-0 h-0" : "opacity-100 h-auto"
                            )}
                        >
                            {t`Administração`}
                        </p>
                        {adminMenuItems.map((item) => (
                            <SidebarMenuItem key={item.href}>
                                <Link to={item.href}>
                                    <SidebarMenuButton
                                        isActive={isActive(item.href)}
                                        tooltip={t(item.label)}
                                        asChild={false}
                                    >
                                        <FontAwesomeIcon icon={item.icon} className="h-5 w-5" />
                                        <span
                                            className={cn(
                                                "transition-all duration-300 ease-in-out",
                                                state === "collapsed" ? "opacity-0 w-0" : "opacity-100"
                                            )}
                                        >
                                            {t(item.label)}
                                        </span>
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
