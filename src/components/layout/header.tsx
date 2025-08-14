
"use client";

import { useState, useEffect } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ShopWiseLogo } from "@/components/icons";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "react-i18next";
import { collection, query, onSnapshot, writeBatch, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Collections } from '@/lib/enums';
import type { Notification } from '@/lib/types';
import { NotificationPopover } from './notification-popover';
import { ShoppingListPopover } from './shopping-list-popover';
import { useSidebar } from '../ui/sidebar';
import { cn } from '@/lib/utils';

export function Header() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    if (!profile?.familyId) return;

    // Fetch notifications
    const notifsRef = collection(db, Collections.Families, profile.familyId, 'notifications');
    const qNotifs = query(notifsRef);
    const notifUnsubscribe = onSnapshot(qNotifs, (snapshot) => {
        const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Notification));
        setNotifications(notifs);
    });

    return () => {
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
       <div className="flex items-center gap-2">
            <SidebarTrigger className="h-8 w-8 shrink-0" />
            <ShopWiseLogo className="hidden h-7 w-auto md:flex" />
        </div>
      
      <div className="flex w-full items-center justify-end gap-2">
        <ShoppingListPopover />
        
        {notifications.length > 0 && (
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
