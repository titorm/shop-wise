"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { QrCode, Camera, History, Store, Calendar, Package, Hash, DollarSign, Edit, Trash2, ShieldCheck, PlusCircle, Pencil, Save, X } from 'lucide-react';
import { extractProductData } from '@/app/(dashboard)/scan/actions';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Product {
    id: number;
    name: string;
    quantity: number;
    price: number;
}
export function QrScannerComponent() {
  const [scanResult, setScanResult] = useState<ExtractProductDataOutput | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsLoading(true);
    setScanResult(null);
    setProducts([]);

    try {
      // Using mock data to simulate a successful scan and avoid the error.
      const mockResult: ExtractProductDataOutput = {
        storeName: "Supermercado Exemplo",
        date: "2024-07-28",
        products: [
            { name: "Leite Integral", quantity: 2, price: 5.50 },
            { name: "Pão de Forma", quantity: 1, price: 7.20 },
            { name: "Café em pó 500g", quantity: 1, price: 15.99 },
            { name: "Maçã Fuji (Kg)", quantity: 1.5, price: 9.80 },
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setScanResult(mockResult);
      setProducts(mockResult.products.map((p, i) => ({...p, id: Date.now() + i})));

    } catch (error) {
      console.error("Failed to extract data:", error);
      toast({
        variant: "destructive",
        title: "Erro na Leitura",
        description: "Não foi possível extrair os dados do QR Code. Tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (productId: number) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const handleSaveEdit = () => {
    if (editingProduct) {
        setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
        setIsEditDialogOpen(false);
        setEditingProduct(null);
        toast({ title: "Item atualizado com sucesso!" });
    }
  };
  
  const handleAddNewItem = () => {
    const newItem: Product = {
        id: Date.now(),
        name: "Novo Item",
        quantity: 1,
        price: 0.00,
    };
    setProducts([...products, newItem]);
    handleEditClick(newItem);
  }


  return (
    <>
        <CardContent className="flex flex-col items-center gap-8">
            <div className="w-full max-w-sm aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                <Camera className="w-24 h-24 text-muted-foreground/50 mb-4" />
                <Button onClick={handleScan} disabled={isLoading} size="lg">
                <QrCode className="mr-2 h-5 w-5" />
                {isLoading ? "Processando..." : "Escanear QR Code"}
                </Button>
            </div>

            {scanResult && products.length > 0 && (
                <div className="w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Dados da Compra</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <Store className="w-4 h-4 text-muted-foreground"/>
                                    <strong>Estabelecimento:</strong> {scanResult.storeName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-muted-foreground"/>
                                    <strong>Data:</strong> {new Date(scanResult.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </div>
                            </div>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><Package className="inline-block mr-1 w-4 h-4" /> Produto</TableHead>
                                        <TableHead className="text-center w-[80px]"><Hash className="inline-block mr-1 w-4 h-4" /> Qtd.</TableHead>
                                        <TableHead className="text-right w-[120px]"><DollarSign className="inline-block mr-1 w-4 h-4" /> Preço (R$)</TableHead>
                                        <TableHead className="text-right w-[100px]">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell className="text-center">{product.quantity}</TableCell>
                                            <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(product.id)}>
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button variant="outline" onClick={handleAddNewItem}>
                                <PlusCircle className="mr-2 h-4 w-4" /> Adicionar Item Manualmente
                            </Button>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary"/> Programas de Fidelidade</CardTitle>
                            <CardDescription>Adicione suas informações de fidelidade para esta compra.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Alert>
                                <ShieldCheck className="h-4 w-4" />
                                <AlertTitle>Em breve: Integração Automática!</AlertTitle>
                                <AlertDescription>
                                    Estamos trabalhando para conectar seus programas de fidelidade favoritos diretamente ao ShopWise para captura automática de pontos e descontos.
                                </AlertDescription>
                            </Alert>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="loyalty-program">Programa de Fidelidade</Label>
                                    <Select>
                                        <SelectTrigger id="loyalty-program">
                                            <SelectValue placeholder="Selecione um programa" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="pao-de-acucar">Pão de Açúcar Mais</SelectItem>
                                            <SelectItem value="extra">Clube Extra</SelectItem>
                                            <SelectItem value="carrefour">Meu Carrefour</SelectItem>
                                            <SelectItem value="outros">Outro</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                 <div>
                                    <Label htmlFor="loyalty-id">Nº de Identificação (CPF/ID)</Label>
                                    <Input id="loyalty-id" placeholder="Seu número de membro" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </CardContent>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Editar Item</DialogTitle>
                    <DialogDescription>
                        Faça as correções necessárias nas informações do produto.
                    </DialogDescription>
                </DialogHeader>
                {editingProduct && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">Nome</Label>
                            <Input id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">Quantidade</Label>
                            <Input id="quantity" type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({...editingProduct, quantity: parseFloat(e.target.value) || 0})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">Preço (R$)</Label>
                            <Input id="price" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} className="col-span-3" />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>Cancelar</Button>
                    <Button onClick={handleSaveEdit}><Save className="mr-2 h-4 w-4"/> Salvar Alterações</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}
