import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestMissingItems } from "../../routes/dashboard/list/actions";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faWandMagicSparkles, faPlus, faShareNodes, faDownload } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { useLingui } from '@lingui/react/macro';
import {
    collection,
    query,
    onSnapshot,
    addDoc,
    doc,
    updateDoc,
    deleteDoc,
    getDocs,
    where,
    limit,
} from "firebase/firestore";
import { Collections } from "@/lib/enums";

import { trackEvent } from "@/services/analytics-service";

interface ListItem {
    id: string;
    name: string;
    checked: boolean;
    quantity: number;
    unit: string;
}

export function ShoppingListComponent() {
    const { t } = useLingui();
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

    const getOrCreateActiveList = useCallback(
        async (familyId: string, userId: string) => {
            const listsRef = collection(db, Collections.Families, familyId, "shopping_lists");
            const q = query(listsRef, where("status", "==", "active"), limit(1));
            const querySnapshot = await getDocs(q);

            if (!querySnapshot.empty) {
                const listDoc = querySnapshot.docs[0];
                return listDoc.id;
            } else {
                const newListRef = await addDoc(listsRef, {
                    name: t`Lista de Compras Principal`,
                    createdAt: new Date(),
                    createdBy: userId,
                    status: "active",
                });
                return newListRef.id;
            }
        },
        [t]
    );

    useEffect(() => {
        if (!profile?.familyId || !profile.uid) return;

        setLoading(true);
        getOrCreateActiveList(profile.familyId, profile.uid).then((listId) => {
            setActiveListId(listId);
            const itemsRef = collection(db, Collections.Families, profile.familyId!, "shopping_lists", listId, "items");
            const q = query(itemsRef);
            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const listItems = querySnapshot.docs.map(
                    (doc) =>
                        ({
                            id: doc.id,
                            ...doc.data(),
                        } as ListItem)
                );
                setItems(listItems);
                setLoading(false);
            });
            return () => unsubscribe();
        });
    }, [profile, getOrCreateActiveList]);

    const handleAddItem = async () => {
        if (newItemName.trim() !== "" && Number(newItemQty) > 0 && profile?.familyId && activeListId) {
            try {
                const itemsRef = collection(
                    db,
                    Collections.Families,
                    profile.familyId,
                    "shopping_lists",
                    activeListId,
                    "items"
                );
                await addDoc(itemsRef, {
                    name: newItemName.trim(),
                    checked: false,
                    quantity: Number(newItemQty),
                    unit: newItemUnit,
                });
                trackEvent("shopping_list_item_added", {
                    itemName: newItemName.trim(),
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
        const item = items.find((i) => i.id === id);
        if (item) {
            const itemRef = doc(
                db,
                Collections.Families,
                profile.familyId,
                "shopping_lists",
                activeListId,
                "items",
                id
            );
            await updateDoc(itemRef, { checked: !item.checked });
        }
    };

    const handleDeleteItem = async (id: string) => {
        if (!profile?.familyId || !activeListId) return;
        const itemRef = doc(db, Collections.Families, profile.familyId, "shopping_lists", activeListId, "items", id);
        await deleteDoc(itemRef);
    };

    const handleGetSuggestions = async () => {
        setIsLoadingSuggestions(true);
        trackEvent("shopping_list_ai_suggestion_requested");
        try {
            const result = await suggestMissingItems({
                // In a real app, this would come from user data
                purchaseHistory: "Leite, Pão, Café, Manteiga, Queijo, Arroz, Feijão",
                familySize: (profile?.family?.adults ?? 1) + (profile?.family?.children ?? 0),
            });

            if (result.error) {
                throw new Error(result.error);
            }

            setSuggestedItems(result.suggestedItems);
        } catch (error: any) {
            console.error("Failed to get suggestions:", error);
            toast({
                variant: "destructive",
                title: t`Erro ao buscar sugestões`,
                description: error.message || t`Houve um problema ao contatar a IA. Por favor, tente novamente mais tarde.`,
            });
        } finally {
            setIsLoadingSuggestions(false);
        }
    };

    const addSuggestionToList = (name: string) => {
        if (!items.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
            setNewItemName(name);
            setNewItemQty(1);
            setNewItemUnit("un");
        }
        setSuggestedItems(suggestedItems.filter((item) => item !== name));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleAddItem();
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    placeholder={t`Adicionar novo item...`}
                    className="flex-grow"
                    onKeyDown={handleKeyDown}
                />
                <div className="flex gap-2">
                    <Input
                        type="number"
                        value={newItemQty}
                        onChange={(e) => setNewItemQty(e.target.value)}
                        placeholder={t`Qtd.`}
                        className="w-20"
                        min="1"
                        onKeyDown={handleKeyDown}
                    />
                    <Select value={newItemUnit} onValueChange={setNewItemUnit}>
                        <SelectTrigger className="w-24">
                            <SelectValue placeholder={t`Unid.`} />
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
                <Button onClick={handleAddItem} className="w-full sm:w-auto mt-2 sm:mt-0">
                    <FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> {t`Adicionar`}
                </Button>
            </div>

            <div className="space-y-2">
                {loading && <p>{t`Carregando lista...`}</p>}
                {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
                        <Checkbox
                            id={`item-${item.id}`}
                            checked={item.checked}
                            onCheckedChange={() => handleToggleItem(item.id)}
                        />
                        <label
                            htmlFor={`item-${item.id}`}
                            className={`flex-grow text-sm font-medium ${
                                item.checked ? "line-through text-muted-foreground" : ""
                            }`}
                        >
                            {item.name}
                        </label>
                        <span className={`text-sm ${item.checked ? "text-muted-foreground" : "text-foreground"}`}>
                            {item.quantity} {item.unit}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => handleDeleteItem(item.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                        </Button>
                    </div>
                ))}
            </div>

            <Separator />

            <div>
                <Button onClick={handleGetSuggestions} disabled={isLoadingSuggestions}>
                    <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 h-4 w-4" />
                    {isLoadingSuggestions ? t`Sugerindo itens...` : t`Sugerir Itens com IA`}
                </Button>

                {suggestedItems.length > 0 && (
                    <Alert className="mt-4">
                        <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                        <AlertTitle>{t`Sugestões Inteligentes`}</AlertTitle>
                        <AlertDescription>
                            <p className="mb-2">{t`Baseado no seu histórico de compras, você talvez precise de:`}</p>
                            <div className="flex flex-wrap gap-2">
                                {suggestedItems.map((name) => (
                                    <Button
                                        key={name}
                                        size="sm"
                                        variant="outline"
                                        onClick={() => addSuggestionToList(name)}
                                    >
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
                <Button variant="outline">
                    <FontAwesomeIcon icon={faShareNodes} className="mr-2 h-4 w-4" /> {t`Compartilhar`}
                </Button>
                <Button variant="outline">
                    <FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> {t`Exportar PDF`}
                </Button>
            </div>
        </div>
    );
}
