
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faStore, faTrash, faThumbsUp, faThumbsDown, faSearch } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { Separator } from "../ui/separator";

const marketSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  type: z.enum(["supermercado", "atacado", "feira", "acougue", "padaria", "outro"]),
  cnpj: z.string().optional(),
  address: z.string().optional(),
});

type MarketData = z.infer<typeof marketSchema>;

// Mock data, in a real app this would come from Firestore
const allStores: (MarketData & {id: string})[] = [
    { id: 'store1', name: "Supermercado Principal", type: "supermercado", cnpj: "12.345.678/0001-99", address: "Rua Principal, 123" },
    { id: 'store2', name: "Atacarejo Preço Baixo", type: "atacado", cnpj: "98.765.432/0001-11", address: "Avenida Central, 456" },
    { id: 'store3', name: "Feira de Sábado", type: "feira", cnpj: "", address: "Praça da Cidade" },
    { id: 'store4', name: "Mercadinho da Esquina", type: "supermercado", cnpj: "", address: "Rua do Bairro, 789" },
];


export function MarketsForm() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  // In a real app, these would be populated from the family document in Firestore
  const [favoriteStores, setFavoriteStores] = useState([allStores[0], allStores[1]]);
  const [ignoredStores, setIgnoredStores] = useState([allStores[3]]);

  const form = useForm<MarketData>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      type: "supermercado",
      cnpj: "",
      address: "",
    },
  });

  const handleAddMarket = (values: MarketData) => {
    // In a real app, this would save to the global 'stores' collection
    // and then add the new store's ID to the family's 'favoriteStores' array.
    const newStore = { ...values, id: `store${Date.now()}` };
    allStores.push(newStore); // Mock adding to global list
    setFavoriteStores([...favoriteStores, newStore]);
    form.reset();
     toast({
        title: "Mercado Adicionado",
        description: `${values.name} foi adicionado aos seus mercados favoritos.`,
    });
  };
  
  const moveToIgnored = (store: MarketData & {id: string}) => {
    setFavoriteStores(favoriteStores.filter(s => s.id !== store.id));
    setIgnoredStores([...ignoredStores, store]);
    toast({ title: "Movido para Ignorados", description: `${store.name} foi movido para a lista de ignorados.` });
  }
  
  const moveToFavorites = (store: MarketData & {id: string}) => {
    setIgnoredStores(ignoredStores.filter(s => s.id !== store.id));
    setFavoriteStores([...favoriteStores, store]);
    toast({ title: "Movido para Favoritos", description: `${store.name} foi movido para a lista de favoritos.` });
  }

  const removeFromFamily = (storeId: string, list: 'favorite' | 'ignored') => {
    if (list === 'favorite') {
        setFavoriteStores(favoriteStores.filter(s => s.id !== storeId));
    } else {
        setIgnoredStores(ignoredStores.filter(s => s.id !== storeId));
    }
    toast({ title: "Mercado Removido", description: `O mercado foi removido das suas listas.` });
  }


  return (
    <div className="space-y-8">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddMarket)}>
                <Card>
                    <CardHeader>
                        <CardTitle>Adicionar Novo Mercado</CardTitle>
                        <CardDescription>Adicione um novo estabelecimento que será salvo globalmente e adicionado aos seus favoritos.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                             <FormField control={form.control} name="name" render={({ field }) => (
                                <FormItem><FormLabel>Nome do Estabelecimento</FormLabel><FormControl><Input placeholder="Ex: Mercado da Esquina" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="type" render={({ field }) => (
                                <FormItem><FormLabel>Tipo</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl><SelectTrigger><SelectValue placeholder="Selecione o tipo" /></SelectTrigger></FormControl>
                                        <SelectContent>
                                            <SelectItem value="supermercado">Supermercado</SelectItem>
                                            <SelectItem value="atacado">Atacado</SelectItem>
                                            <SelectItem value="feira">Feira</SelectItem>
                                            <SelectItem value="acougue">Açougue</SelectItem>
                                            <SelectItem value="padaria">Padaria</SelectItem>
                                            <SelectItem value="outro">Outro</SelectItem>
                                        </SelectContent>
                                    </Select><FormMessage />
                                </FormItem>
                            )}/>
                            <FormField control={form.control} name="cnpj" render={({ field }) => (
                                <FormItem><FormLabel>CNPJ (Opcional)</FormLabel><FormControl><Input placeholder="00.000.000/0001-00" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                            <FormField control={form.control} name="address" render={({ field }) => (
                                <FormItem><FormLabel>Endereço (Opcional)</FormLabel><FormControl><Input placeholder="Rua, Número, Bairro" {...field} /></FormControl><FormMessage /></FormItem>
                            )}/>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit"><FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />Adicionar aos Favoritos</Button>
                    </CardFooter>
                </Card>
            </form>
        </Form>
        
        <Separator />

        <MarketList 
            title="Mercados Favoritos"
            description="Estes são os mercados que você mais utiliza."
            icon={faThumbsUp}
            stores={favoriteStores}
            onAction={moveToIgnored}
            onRemove={removeFromFamily}
            actionIcon={faThumbsDown}
            actionTooltip="Mover para ignorados"
            listType="favorite"
        />

        <MarketList 
            title="Mercados Ignorados"
            description="Você não verá recomendações ou insights destes mercados."
            icon={faThumbsDown}
            stores={ignoredStores}
            onAction={moveToFavorites}
            onRemove={removeFromFamily}
            actionIcon={faThumbsUp}
            actionTooltip="Mover para favoritos"
            listType="ignored"
        />
    </div>
  );
}


interface MarketListProps {
    title: string;
    description: string;
    icon: any;
    stores: (MarketData & {id: string})[];
    onAction: (store: MarketData & {id: string}) => void;
    onRemove: (storeId: string, list: 'favorite' | 'ignored') => void;
    actionIcon: any;
    actionTooltip: string;
    listType: 'favorite' | 'ignored';
}

function MarketList({ title, description, icon, stores, onAction, onRemove, actionIcon, actionTooltip, listType }: MarketListProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <FontAwesomeIcon icon={icon} className="w-5 h-5" />
                    {title}
                </CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" /> Nome</TableHead>
                                <TableHead>Tipo</TableHead>
                                <TableHead>Endereço</TableHead>
                                <TableHead className="w-[120px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stores.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center h-24">Nenhum mercado nesta lista.</TableCell>
                                </TableRow>
                            )}
                            {stores.map((store) => (
                                <TableRow key={store.id}>
                                    <TableCell className="font-medium">{store.name}</TableCell>
                                    <TableCell>{store.type}</TableCell>
                                    <TableCell>{store.address}</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1">
                                            <Button variant="ghost" size="icon" title={actionTooltip} onClick={() => onAction(store)}>
                                                <FontAwesomeIcon icon={actionIcon} className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" title="Remover da família" onClick={() => onRemove(store.id, listType)}>
                                                <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
