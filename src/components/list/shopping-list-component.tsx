
"use client";

import { useState } from "react";
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

interface ListItem {
  id: number;
  name: string;
  checked: boolean;
  quantity: number;
  unit: string;
}

export function ShoppingListComponent() {
  const [items, setItems] = useState<ListItem[]>([
    { id: 1, name: "Leite Integral", checked: false, quantity: 2, unit: "L" },
    { id: 2, name: "Pão de Forma", checked: true, quantity: 1, unit: "un" },
    { id: 3, name: "Café em pó", checked: false, quantity: 500, unit: "g" },
  ]);
  const [newItemName, setNewItemName] = useState("");
  const [newItemQty, setNewItemQty] = useState<number | string>(1);
  const [newItemUnit, setNewItemUnit] = useState("un");

  const [suggestedItems, setSuggestedItems] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleAddItem = () => {
    if (newItemName.trim() !== "" && Number(newItemQty) > 0) {
      setItems([...items, { 
        id: Date.now(), 
        name: newItemName.trim(), 
        checked: false,
        quantity: Number(newItemQty),
        unit: newItemUnit,
      }]);
      setNewItemName("");
      setNewItemQty(1);
      setNewItemUnit("un");
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
        setItems([...items, { id: Date.now(), name, checked: false, quantity: 1, unit: 'un' }]);
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
          placeholder="Adicionar item..."
          className="flex-grow"
          onKeyDown={handleKeyDown}
        />
        <div className="flex gap-2">
          <Input
            type="number"
            value={newItemQty}
            onChange={(e) => setNewItemQty(e.target.value)}
            placeholder="Qtd."
            className="w-20"
            min="1"
            onKeyDown={handleKeyDown}
          />
          <Select value={newItemUnit} onValueChange={setNewItemUnit}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="Unidade" />
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
        <Button onClick={handleAddItem} className="w-full sm:w-auto mt-2 sm:mt-0"><FontAwesomeIcon icon={faPlus} className="mr-2 h-4 w-4" /> Adicionar</Button>
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
        <Button onClick={handleGetSuggestions} disabled={isLoading}>
            <FontAwesomeIcon icon={faWandMagicSparkles} className="mr-2 h-4 w-4" />
            {isLoading ? "Sugerindo..." : "Sugerir Itens com IA"}
        </Button>

        {suggestedItems.length > 0 && (
            <Alert className="mt-4">
                <FontAwesomeIcon icon={faWandMagicSparkles} className="h-4 w-4" />
                <AlertTitle>Sugestões Inteligentes</AlertTitle>
                <AlertDescription>
                    <p className="mb-2">Com base no seu histórico, talvez você precise destes itens:</p>
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
        <Button variant="outline"><FontAwesomeIcon icon={faShareNodes} className="mr-2 h-4 w-4" /> Compartilhar</Button>
        <Button variant="outline"><FontAwesomeIcon icon={faDownload} className="mr-2 h-4 w-4" /> Exportar PDF</Button>
      </div>
    </div>
  );
}
