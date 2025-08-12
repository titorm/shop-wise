
"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestMissingItems } from "@/app/(dashboard)/list/actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faWandMagicSparkles, faPlus, faShareNodes, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, query, onSnapshot, addDoc, doc, updateDoc, deleteDoc, getDocs, where, limit } from "firebase/firestore";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";

interface ListItem {
  id: string;
  name: string;
  checked: boolean;
  quantity: number;
  unit: string;
}

export function ShoppingListComponent() {
  const { t } = useTranslation();
  const { profile } = useAuth();
  const [items, setItems] = useState<ListItem[]>([]);
  const [activeListId, setActiveListId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState<number | string>(1);
  const [newItemUnit, setNewItemUnit] = useState("un");

  const [suggestedItems, setSuggestedItems] = useState<string[]>([]);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const { toast } = useToast();

  const getOrCreateActiveList = useCallback(async (familyId: string, userId: string) => {
    const listsRef = collection(db, Collections.Families, familyId, 'shopping_lists');
    const q = query(listsRef, where("status", "==", "active"), limit(1));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
        const listDoc = querySnapshot.docs[0];
        return listDoc.id;
    } else {
        const newListRef = await addDoc(listsRef, {
            name: t('default_shopping_list_name'),
            createdAt: new Date(),
            createdBy: userId,
            status: 'active',
        });
        return newListRef.id;
    }
  }, [t]);

  useEffect(() => {
    if (!profile?.familyId || !profile.uid) return;

    setLoading(true);
    getOrCreateActiveList(profile.familyId, profile.uid).then(listId => {
        setActiveListId(listId);
        const itemsRef = collection(db, Collections.Families, profile.familyId, 'shopping_lists', listId, 'items');
        const q = query(itemsRef);
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const listItems = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as ListItem));
            setItems(listItems);
            setLoading(false);
        });
        return () => unsubscribe();
    });
  }, [profile, getOrCreateActiveList]);


  const handleAddItem = async () => {
    if (newItemName.trim() !== "" && Number(newItemQty) > 0 && profile?.familyId && activeListId) {
        try {
            const itemsRef = collection(db, Collections.Families, profile.familyId, 'shopping_lists', activeListId, 'items');
            await addDoc(itemsRef, { 
                name: newItemName.trim(), 
                checked: false,
                quantity: Number(newItemQty),
                unit: newItemUnit,
            });
            setNewItemName("");
            setNewItemQty(1);
            setNewItemUnit("un");
        } catch (error) {
            console.error("Error adding item: ", error);
        }
    }
  };

  const handleToggleItem = async (id: string) => {
    if (!profile?.familyId || !activeListId) return;
    const item = items.find(i => i.id === id);
    if(item) {
        const itemRef = doc(db, Collections.Families, profile.familyId, 'shopping_lists', activeListId, 'items', id);
        await updateDoc(itemRef, { checked: !item.checked });
    }
  };
  
  const handleDeleteItem = async (id: string) => {
    if (!profile?.familyId || !activeListId) return;
    const itemRef = doc(db, Collections.Families, profile.familyId, 'shopping_lists', activeListId, 'items', id);
    await deleteDoc(itemRef);
  };
  
  const handleGetSuggestions = async () => {
    setIsLoadingSuggestions(true);
    try {
        const result = await suggestMissingItems({
            // In a real app, this would come from user data
            purchaseHistory: "Leite, Pão, Café, Manteiga, Queijo, Arroz, Feijão",
            familySize: (profile?.family?.adults ?? 1) + (profile?.family?.children ?? 0),
        });
        setSuggestedItems(result.suggestedItems);
    } catch (error) {
        console.error("Failed to get suggestions:", error);
        toast({
            variant: "destructive",
            title: t('error_getting_suggestions'),
            description: t('error_getting_suggestions_desc'),
        });
    } finally {
        setIsLoadingSuggestions(false);
    }
  };

  const addSuggestionToList = (name: string) => {
    if (!items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        setNewItemName(name);
        setNewItemQty(1);
        setNewItemUnit('un');
    }
    setSuggestedItems(suggestedItems.filter(item => item !== name));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAddItem();
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          value={newItemName}
          onChange={(e) => setNewItemName(e.target.value)}
          placeholder={t('add_item_placeholder')}
          className="flex-grow"
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            placeholder={t('quantity_placeholder')}
            className="w-20"
            min="1"
            onKeyDown={handleKeyDown}
          />
          <Select value={newItemUnit} onValueChange={setNewItemUnit}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder={t('unit_placeholder')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="un">un</SelectItem>
              <SelectItem value="kg">kg</SelectItem>
              <SelectItem value="g">g</SelectItem>
              <SelectItem value="L">L</SelectItem>
              <SelectItem value="ml">ml</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button onClick={handleAddItem} className="w-full sm:w-auto mt-2 sm:mt-0"><FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> {t('add_button')}</Button>
      </div>
      
      <div className="space-y-2">
        {loading && <p>{t('loading_list')}</p>}
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.checked}
              onCheckedChange={() => handleToggleItem(item.id)}
            />
            <label
              htmlFor={`item-${item.id}`}
              className={`flex-grow text-sm font-medium ${item.checked ? "line-through text-muted-foreground" : ""}`}
            >
              {item.name}
            </label>
             <span className={`text-sm ${item.checked ? "text-muted-foreground" : "text-foreground"}`}>
              {item.quantity} {item.unit}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteItem(item.id)}>
              <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

        <Separator />

      <div>
        <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions}>
            <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 h-4 w-4" />
            {isLoadingSuggestions ? t('suggesting_items') : t('suggest_items_ai')}
        </Button>

        {suggestedItems.length > 0 && (
            <Alert className="mt-4">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                <AlertTitle>{t('smart_suggestions')}</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">{t('suggestions_based_on_history')}</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedItems.map((name) => (
                            <Button key={name} size="sm" variant="outline" onClick={() => addSuggestionToList(name)}>
                                <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> {name}
                            </Button>
                        ))}
                    </div>
                </AlertDescription>
            </Alert>
        )}
      </div>

      <Separator />

      <div className="flex gap-2">
        <Button variant="outline"><FontAwesomeIcon icon={faShareNodes} className="mr-2 h-4 w-4" /> {t('share')}</Button>
        <Button variant="outline"><FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> {t('export_pdf')}</Button>
      </div>
    </div>
  );
}

    