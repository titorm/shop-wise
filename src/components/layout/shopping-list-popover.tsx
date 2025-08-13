
"use client";

import { useState, useEffect, useCallback } from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, where, limit, onSnapshot, getDocs, doc, updateDoc } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart, faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Checkbox } from '../ui/checkbox';
import Link from 'next/link';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
}

export function ShoppingListPopover() {
    const { t } = useTranslation();
    const { profile } = useAuth();
    const [items, setItems] = useState<ListItem[]>([]);
    const [activeListId, setActiveListId] = useState<string | null>(null);
    const [listName, setListName] = useState('');

    const getActiveList = useCallback(async (familyId: string) => {
        const listsRef = collection(db, Collections.Families, familyId, 'shopping_lists');
        const q = query(listsRef, where("status", "==", "active"), limit(1));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const listDoc = querySnapshot.docs[0];
            setActiveListId(listDoc.id);
            setListName(listDoc.data().name);
            return listDoc.id;
        }
        return null;
    }, []);
    
    useEffect(() => {
        if (!profile?.familyId) return;

        getActiveList(profile.familyId).then(listId => {
            if (listId) {
                const itemsRef = collection(db, Collections.Families, profile.familyId!, 'shopping_lists', listId, 'items');
                const q = query(itemsRef);
                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const listItems = querySnapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    } as ListItem));
                    setItems(listItems);
                });
                return () => unsubscribe();
            }
        });
    }, [profile, getActiveList]);
    
    const handleToggleItem = async (id: string) => {
        if (!profile?.familyId || !activeListId) return;
        const item = items.find(i => i.id === id);
        if(item) {
            const itemRef = doc(db, Collections.Families, profile.familyId, 'shopping_lists', activeListId, 'items', id);
            await updateDoc(itemRef, { checked: !item.checked });
        }
    };

    const generateGoogleKeepLink = () => {
        const title = encodeURIComponent(listName);
        const text = encodeURIComponent(
            items.map(item => `${item.checked ? '☑' : '☐'} ${item.name}`).join('\n')
        );
        return `https://keep.google.com/u/0/#NOTE/${Date.now()}:${Date.now()}/${title}/${text}`;
    };

    if (items.length === 0) {
        return null;
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" size="icon">
                    <FontAwesomeIcon icon={faShoppingCart} className="h-5 w-5" />
                    <span className="sr-only">{t('active_shopping_list')}</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
                <div className="flex flex-col space-y-4">
                    <div className="space-y-2">
                        <h4 className="font-medium leading-none">{listName}</h4>
                        <p className="text-sm text-muted-foreground">
                            {t('active_list_popover_desc')}
                        </p>
                    </div>
                    <Separator />
                    <ScrollArea className="h-64">
                         <div className="space-y-2">
                            {items.map(item => (
                            <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                                <Checkbox
                                id={`popover-item-${item.id}`}
                                checked={item.checked}
                                onCheckedChange={() => handleToggleItem(item.id)}
                                />
                                <label
                                htmlFor={`popover-item-${item.id}`}
                                className={`flex-grow text-sm font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}
                                >
                                {item.name}
                                </label>
                            </div>
                            ))}
                        </div>
                    </ScrollArea>
                    <Separator />
                    <div className="flex flex-col gap-2">
                         <Button variant="outline" asChild>
                            <a href={generateGoogleKeepLink()} target="_blank" rel="noopener noreferrer">
                                <FontAwesomeIcon icon={faGoogle} className="mr-2 h-4 w-4" />
                                {t('export_google_keep')}
                            </a>
                        </Button>
                         <Button variant="secondary" asChild>
                            <Link href="/list">
                                 <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2 h-4 w-4" />
                                {t('view_full_list')}
                            </Link>
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
