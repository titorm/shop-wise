
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getUserInitials } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";

export function Header() {
  const { t } = useTranslation();
  const { user } = useAuth();


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Logo className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold font-headline">{t('shopwise')}</span>
      </div>
      
      <div className="flex w-full items-center justify-end gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/list">
            <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
            <span>
              <span className="sr-only">{t('active_shopping_list')}</span>
            </span>
          </Link>
        </Button>
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
          <span className="sr-only">{t('notifications')}</span>
        </Button>
        {user && (
           <Avatar className="h-9 w-9">
              <AvatarImage src={user?.photoURL ?? ""} alt={user?.displayName ?? "User Avatar"} />
              <AvatarFallback>{getUserInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
        )}
      </div>
    </header>
  );
}
