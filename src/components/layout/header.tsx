
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShopWiseLogo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { collection, query, where, getDocs, limit, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collections } from '@/lib/enums';
import type { Notification } from '@/lib/types';
import { NotificationPopover } from './notification-popover';

export function Header() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [hasActiveList, setHasActiveList] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!profile?.familyId) return;

    // Check for active shopping list
    const listsRef = collection(db, Collections.Families, profile.familyId, 'shopping_lists');
    const qLists = query(listsRef, where("status", "==", "active"), limit(1));
    const listUnsubscribe = onSnapshot(qLists, (querySnapshot) => {
      setHasActiveList(!querySnapshot.empty);
    });

    // Fetch notifications
    const notifsRef = collection(db, Collections.Families, profile.familyId, 'notifications');
    const qNotifs = query(notifsRef);
    const notifUnsubscribe = onSnapshot(qNotifs, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(notifs);
    });

    return () => {
        listUnsubscribe();
        notifUnsubscribe();
    };
  }, [profile]);

  const unreadNotifications = notifications.filter(n => !n.read);

  const markAllAsRead = async () => {
    if (!profile?.familyId || unreadNotifications.length === 0) return;
    const batch = writeBatch(db);
    unreadNotifications.forEach(notif => {
        const notifRef = doc(db, Collections.Families, profile.familyId!, 'notifications', notif.id);
        batch.update(notifRef, { read: true });
    });
    await batch.commit();
  };


  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex h-full items-center justify-center w-[var(--sidebar-width-icon)]">
        <SidebarTrigger />
      </div>
      <ShopWiseLogo className="w-auto h-7 text-foreground" />
      
      <div className="flex w-full items-center justify-end gap-2">
        {hasActiveList && (
            <Button variant="ghost" size="icon" asChild>
            <Link href="/list">
                <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                <span className="sr-only">{t('active_shopping_list')}</span>
            </Link>
            </Button>
        )}
        
        {unreadNotifications.length > 0 && (
          <NotificationPopover 
            notifications={notifications} 
            unreadCount={unreadNotifications.length} 
            onMarkAllAsRead={markAllAsRead} 
          />
        )}
      </div>
    </header>
  );
}
