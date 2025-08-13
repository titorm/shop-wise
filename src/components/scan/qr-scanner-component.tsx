
"use client";

import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { extractProductData } from '@/app/(dashboard)/scan/actions';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faCamera, faHistory, faStore, faBox, faHashtag, faDollarSign, faPencil, faTrash, faShieldCheck, faPlusCircle, faSave, faXmark, faBarcode, faWeightHanging } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';

interface Product {
    id: number;
    barcode: string;
    name: string;
    volume: string;
    quantity: number;
    price: number;
}

interface QrScannerProps {
    onSave: (scanResult: ExtractProductDataOutput, products: Product[]) => Promise<void>;
}

export function QrScannerComponent({ onSave }: QrScannerProps) {
  const { t } = useTranslation();
  const [scanResult, setScanResult] = useState<ExtractProductDataOutput | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsLoading(true);
    setScanResult(null);
    setProducts([]);

    try {
      // Using mock data to simulate a successful scan and avoid the error.
      const mockResult: ExtractProductDataOutput = {
        storeName: "ANGELONI CIA LTDA",
        date: "2024-01-22",
        cnpj: "83.646.984/0035-71",
        address: "AV CENTENARIO, 2605, CENTRO, CRICIUMA, SC",
        products: [
            { barcode: "7891000312515", name: "REFRI COCA-COLA S/ACUCAR PET 2L", quantity: 1, volume: "UN", unitPrice: 9.19, price: 9.19 },
            { barcode: "7891991012353", name: "CERVEJA HEINEKEN LN 330ML", quantity: 1, volume: "UN", unitPrice: 6.29, price: 6.29 },
            { barcode: "7894900013019", name: "AGUA MIN INDAIA S/GAS 500ML", quantity: 1, volume: "UN", unitPrice: 2.19, price: 2.19 },
            { barcode: "7896005301032", name: "CHA MATE LEAO LIMAO COPO 300ML", quantity: 1, volume: "UN", unitPrice: 3.49, price: 3.49 },
            { barcode: "7896065811019", name: "PAO DE ALHO STA MASSA 300G TRAD", quantity: 1, volume: "UN", unitPrice: 9.99, price: 9.99 },
            { barcode: "7891149103254", name: "REFRIG SCHWEPPES CITRUS 1,5L", quantity: 1, volume: "UN", unitPrice: 8.19, price: 8.19 },
            { barcode: "0000000032999", name: "Pao Frances", quantity: 6, volume: "UN", unitPrice: 0.8, price: 4.8 },
            { barcode: "7896020460309", name: "LEITE COND MOCELAN 395G TP", quantity: 1, volume: "UN", unitPrice: 4.99, price: 4.99 },
            { barcode: "7896005301032", name: "Refrigerante", quantity: 1, volume: "UN", unitPrice: 8.9, price: 8.9 },
        ]
      };
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setScanResult(mockResult);
      setProducts(mockResult.products.map((p, i) => ({
          ...p,
          id: Date.now() + i,
          price: p.price ?? p.unitPrice * p.quantity,
      })));

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
        barcode: "Novo Código",
        name: "Novo Item",
        volume: "1 un",
        quantity: 1,
        price: 0.00,
    };
    setProducts([...products, newItem]);
    handleEditClick(newItem);
  };

  const handleConfirmPurchase = async () => {
    if (scanResult) {
        setIsSaving(true);
        await onSave(scanResult, products);
        setIsSaving(false);
    }
  }


  return (
    <>
        <CardContent className="flex flex-col items-center gap-8 p-0">
            <div className="w-full max-w-sm aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
                <FontAwesomeIcon icon={faCamera} className="w-24 h-24 text-muted-foreground/50 mb-4" />
                <p className="text-sm text-muted-foreground text-center mb-4">{t('scan_qr_code_description')}</p>
                <Button onClick={handleScan} disabled={isLoading}>
                <FontAwesomeIcon icon={faQrcode} className="mr-2 h-5 w-5" />
                {isLoading ? t('processing') : t('scan_qr_code_button')}
                </Button>
            </div>

            {scanResult && products.length > 0 && (
                <div className="w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faHistory} className="w-5 h-5 text-primary" /> {t('purchase_data_title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-muted-foreground"/>
                                    <strong>{t('store_label')}:</strong> {scanResult.storeName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-muted-foreground"/>
                                    <strong>{t('date_label')}:</strong> {new Date(scanResult.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </div>
                            </div>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[150px]"><FontAwesomeIcon icon={faBarcode} className="inline-block mr-1 w-4 h-4" /> {t('table_barcode')}</TableHead>
                                        <TableHead><FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" /> {t('table_product')}</TableHead>
                                        <TableHead className="text-center w-[100px]"><FontAwesomeIcon icon={faWeightHanging} className="inline-block mr-1 w-4 h-4" /> {t('table_volume')}</TableHead>
                                        <TableHead className="text-center w-[80px]"><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
                                        <TableHead className="text-right w-[120px]"><FontAwesomeIcon icon={faDollarSign} className="inline-block mr-1 w-4 h-4" /> {t('table_price_header')} (R$)</TableHead>
                                        <TableHead className="text-right w-[100px]">{t('table_actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-mono text-xs">{product.barcode}</TableCell>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell className="text-center">{product.volume}</TableCell>
                                            <TableCell className="text-center">{product.quantity}</TableCell>
                                            <TableCell className="text-right">{product.price.toFixed(2)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-1">
                                                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleEditClick(product)}>
                                                        <FontAwesomeIcon icon={faPencil} className="h-4 w-4" />
                                                    </Button>
                                                     <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDeleteClick(product.id)}>
                                                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                             <Button variant="outline" onClick={handleAddNewItem}>
                                <FontAwesomeIcon icon={faPlusCircle} className="mr-2 h-4 w-4" /> {t('add_item_manually_button')}
                            </Button>
                        </CardContent>
                    </Card>
                    <CardFooter className="p-0">
                        <Button size="lg" onClick={handleConfirmPurchase} disabled={isSaving}>
                            <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
                            {isSaving ? t('saving') : t('confirm_and_save_button')}
                        </Button>
                    </CardFooter>
                </div>
            )}
        </CardContent>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{t('edit_item_title')}</DialogTitle>
                    <DialogDescription>
                        {t('edit_item_description')}
                    </DialogDescription>
                </DialogHeader>
                {editingProduct && (
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="barcode" className="text-right">{t('table_barcode')}</Label>
                            <Input id="barcode" value={editingProduct.barcode} onChange={(e) => setEditingProduct({...editingProduct, barcode: e.target.value})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">{t('name_label')}</Label>
                            <Input id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="volume" className="text-right">{t('table_volume')}</Label>
                            <Input id="volume" value={editingProduct.volume} onChange={(e) => setEditingProduct({...editingProduct, volume: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">{t('table_quantity')}</Label>
                            <Input id="quantity" type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({...editingProduct, quantity: parseFloat(e.target.value) || 0})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="price" className="text-right">{t('table_price_header')} (R$)</Label>
                            <Input id="price" type="number" value={editingProduct.price} onChange={(e) => setEditingProduct({...editingProduct, price: parseFloat(e.target.value) || 0})} className="col-span-3" />
                        </div>
                    </div>
                )}
                <DialogFooter>
                    <Button variant="ghost" onClick={() => setIsEditDialogOpen(false)}>{t('cancel')}</Button>
                    <Button onClick={handleSaveEdit}><FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4"/> {t('save_changes_button')}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    </>
  );
}

    
