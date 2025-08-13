
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray } from "react-hook-form";
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
import { faPlusCircle, faStore, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

const marketSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres."),
  type: z.enum(["supermercado", "atacado", "feira", "acougue", "padaria", "outro"]),
});

const marketsFormSchema = z.object({
  markets: z.array(marketSchema),
});

type MarketData = z.infer<typeof marketSchema>;

const initialMarkets: MarketData[] = [
    { name: "Supermercado Principal", type: "supermercado" },
    { name: "Atacarejo Preço Baixo", type: "atacado" },
    { name: "Feira de Sábado", type: "feira" },
];


export function MarketsForm() {
  const { profile } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();
  const [markets, setMarkets] = useState<MarketData[]>(initialMarkets);


  const form = useForm<MarketData>({
    resolver: zodResolver(marketSchema),
    defaultValues: {
      name: "",
      type: "supermercado",
    },
  });

  const handleAddMarket = (values: MarketData) => {
    // In a real app, this would also save to Firestore
    setMarkets([...markets, values]);
    form.reset();
     toast({
        title: t('toast_success_title'),
        description: "Mercado adicionado com sucesso!",
    });
  };
  
  const handleRemoveMarket = (index: number) => {
    // In a real app, this would also remove from Firestore
    const newMarkets = [...markets];
    newMarkets.splice(index, 1);
    setMarkets(newMarkets);
    toast({
        title: t('toast_success_title'),
        description: "Mercado removido com sucesso!",
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('tab_markets_title')}</CardTitle>
        <CardDescription>{t('tab_markets_desc')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddMarket)}>
          <CardContent className="space-y-6">
             <div className="flex flex-col md:flex-row gap-4 items-end">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                    <FormItem className="flex-grow">
                        <FormLabel>Nome do Estabelecimento</FormLabel>
                        <FormControl>
                            <Input placeholder="Ex: Mercado da Esquina" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                    <FormItem className="w-full md:w-[200px]">
                        <FormLabel>Tipo</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="supermercado">Supermercado</SelectItem>
                                <SelectItem value="atacado">Atacado</SelectItem>
                                <SelectItem value="feira">Feira</SelectItem>
                                <SelectItem value="acougue">Açougue</SelectItem>
                                <SelectItem value="padaria">Padaria</SelectItem>
                                <SelectItem value="outro">Outro</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <Button type="submit" className="w-full md:w-auto">
                    <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" />
                    Adicionar
                </Button>
            </div>
             <div>
                <h4 className="text-base font-medium mb-2">Meus Mercados</h4>
                <div className="border rounded-md">
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead><FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" /> Nome</TableHead>
                                <TableHead className="w-[150px]">Tipo</TableHead>
                                <TableHead className="w-[100px] text-right">Ações</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {markets.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="text-center h-24">
                                        Nenhum mercado cadastrado.
                                    </TableCell>
                                </TableRow>
                            )}
                            {markets.map((market, index) => (
                                <TableRow key={index}>
                                    <TableCell className="font-medium">{market.name}</TableCell>
                                    <TableCell>{market.type}</TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMarket(index)}>
                                            <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
          </CardContent>
        </form>
      </Form>
    </Card>
  );
}
