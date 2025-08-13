
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Logo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collections } from '@/lib/enums';

export function Header() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [hasActiveList, setHasActiveList] = useState(false);

  useEffect(() => {
    const checkActiveList = async () => {
      if (profile?.familyId) {
        const listsRef = collection(db, Collections.Families, profile.familyId, 'shopping_lists');
        const q = query(listsRef, where("status", "==", "active"), limit(1));
        const querySnapshot = await getDocs(q);
        setHasActiveList(!querySnapshot.empty);
      }
    };

    checkActiveList();
  }, [profile]);


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <Logo className="w-6 h-6 text-primary" />
        <span className="text-lg font-bold font-headline">{t('shopwise')}</span>
      </div>
      
      <div className="flex w-full items-center justify-end gap-2">
        {hasActiveList && (
            <Button variant="ghost" size="icon" asChild>
            <Link href="/list">
                <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                <span>
                <span className="sr-only">{t('active_shopping_list')}</span>
                </span>
            </Link>
            </Button>
        )}
        <Button variant="ghost" size="icon">
          <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
          <span className="sr-only">{t('notifications')}</span>
        </Button>
      </div>
    </header>
  );
}
