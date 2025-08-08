"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Trash2, Sparkles, Plus, Share2, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { suggestMissingItems } from "@/app/(dashboard)/list/actions";
import { useToast } from "@/hooks/use-toast";

interface ListItem {
  id: number;
  name: string;
  checked: boolean;
}

export function ShoppingListComponent() {
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, name: "Leite Integral", checked: false },
    { id: 2, name: "Pão de Forma", checked: true },
    { id: 3, name: "Café em pó", checked: false },
  ]);
  const [newItem, setNewItem] = useState("");
  const [suggestedItems, setSuggestedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (newItem.trim() !== "") {
      setItems([...items, { id: Date.now(), name: newItem.trim(), checked: false }]);
      setNewItem("");
    }
  };

  const handleToggleItem = (id: number) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };
  
  const handleDeleteItem = (id: number) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const handleGetSuggestions = async () => {
    setIsLoading(true);
    try {
        const result = await suggestMissingItems({
            // In a real app, this would come from user data
            purchaseHistory: "Leite, Pão, Café, Manteiga, Queijo, Arroz, Feijão",
            familySize: 4 
        });
        setSuggestedItems(result.suggestedItems);
    } catch (error) {
        console.error("Failed to get suggestions:", error);
        toast({
            variant: "destructive",
            title: "Erro ao buscar sugestões",
            description: "Não foi possível obter sugestões da IA. Tente novamente mais tarde.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  const addSuggestionToList = (name: string) => {
    if (!items.some(item => item.name.toLowerCase() === name.toLowerCase())) {
        setItems([...items, { id: Date.now(), name, checked: false }]);
    }
    setSuggestedItems(suggestedItems.filter(item => item !== name));
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Input
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Adicionar item..."
          onKeyDown={(e) => e.key === 'Enter' && handleAddItem()}
        />
        <Button onClick={handleAddItem}><Plus className="mr-2 h-4 w-4" /> Adicionar</Button>
      </div>
      
      <div className="space-y-2">
        {items.map(item => (
          <div key={item.id} className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50">
            <Checkbox
              id={`item-${item.id}`}
              checked={item.checked}
              onCheckedChange={() => handleToggleItem(item.id)}
            />
            <label
              htmlFor={`item-${item.id}`}
              className={`flex-grow text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}
            >
              {item.name}
            </label>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteItem(item.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

        <Separator />

      <div>
        <Button onClick={handleGetSuggestions} disabled={isLoading}>
            <Sparkles className="mr-2 h-4 w-4" />
            {isLoading ? "Sugerindo..." : "Sugerir Itens com IA"}
        </Button>

        {suggestedItems.length > 0 && (
            <Alert className="mt-4">
                <Sparkles className="h-4 w-4" />
                <AlertTitle>Sugestões Inteligentes</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">Com base no seu histórico, talvez você precise destes itens:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestedItems.map((name) => (
                            <Button key={name} size="sm" variant="outline" onClick={() => addSuggestionToList(name)}>
                                <Plus className="mr-2 h-4 w-4" /> {name}
                            </Button>
                        ))}
                    </div>
                </AlertDescription>
            </Alert>
        )}
      </div>

      <Separator />

      <div className="flex gap-2">
        <Button variant="outline"><Share2 className="mr-2 h-4 w-4" /> Compartilhar</Button>
        <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Exportar PDF</Button>
      </div>
    </div>
  );
}
