
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { extractDataFromPdf as extractDataFromPdfFlow } from '@/ai/flows/extract-data-from-pdf';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faStore, faBox, faHashtag, faDollarSign, faPencil, faTrash, faPlusCircle, faSave, faCopyright, faBug, faFilePdf, faTags } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';

interface Product {
    id: number;
    barcode: string;
    name: string;
    volume: string;
    quantity: number;
    price: number;
    unitPrice: number;
    category?: string;
    subcategory?: string;
    brand?: string;
}

interface QrScannerProps {
    onSave: (scanResult: ExtractProductDataOutput, products: Product[]) => Promise<void>;
}


export function QrScannerComponent({ onSave }: QrScannerProps) {
  const { t } = useTranslation();
  const [extractionResult, setExtractionResult] = useState<ExtractProductDataOutput | null>(null);
  const [debugResult, setDebugResult] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);


  const getCategoryClass = (category?: string) => {
    if (!category) return "bg-secondary text-secondary-foreground";
    const categoryMap: { [key: string]: string } = {
        "Hortifrúti e Ovos": "bg-category-produce-and-eggs/50 text-category-produce-and-eggs-foreground border-category-produce-and-eggs/20",
        "Açougue e Peixaria": "bg-category-meat-and-seafood/50 text-category-meat-and-seafood-foreground border-category-meat-and-seafood/20",
        "Padaria e Confeitaria": "bg-category-bakery-and-deli/50 text-category-bakery-and-deli-foreground border-category-bakery-and-deli/20",
        "Laticínios e Frios": "bg-category-dairy-and-chilled/50 text-category-dairy-and-chilled-foreground border-category-dairy-and-chilled/20",
        "Mercearia": "bg-category-pantry-and-dry-goods/50 text-category-pantry-and-dry-goods-foreground border-category-pantry-and-dry-goods/20",
        "Matinais e Doces": "bg-category-breakfast-and-snacks/50 text-category-breakfast-and-snacks-foreground border-category-breakfast-and-snacks/20",
        "Congelados": "bg-category-frozen-foods/50 text-category-frozen-foods-foreground border-category-frozen-foods/20",
        "Bebidas": "bg-category-beverages/50 text-category-beverages-foreground border-category-beverages/20",
        "Limpeza": "bg-category-cleaning-and-household/50 text-category-cleaning-and-household-foreground border-category-cleaning-and-household/20",
        "Higiene Pessoal": "bg-category-personal-care/50 text-category-personal-care-foreground border-category-personal-care/20",
        "Bebês e Crianças": "bg-category-baby-and-child-care/50 text-category-baby-and-child-care-foreground border-category-baby-and-child-care/20",
        "Pet Shop": "bg-category-pet-supplies/50 text-category-pet-supplies-foreground border-category-pet-supplies/20",
        "Utilidades e Bazar": "bg-category-home-and-general/50 text-category-home-and-general-foreground border-category-home-and-general/20",
        "Farmácia": "bg-category-pharmacy/50 text-category-pharmacy-foreground border-category-pharmacy/20",
        "Default": "bg-secondary text-secondary-foreground"
    };
    return categoryMap[category] || categoryMap.Default;
  }
  
  const getSubcategoryClass = (category?: string) => {
    if (!category) return "bg-secondary/50 text-secondary-foreground";
    const subcategoryMap: { [key: string]: string } = {
        "Hortifrúti e Ovos": "bg-category-produce-and-eggs/30 text-category-produce-and-eggs-foreground border-category-produce-and-eggs/10",
        "Açougue e Peixaria": "bg-category-meat-and-seafood/30 text-category-meat-and-seafood-foreground border-category-meat-and-seafood/10",
        "Padaria e Confeitaria": "bg-category-bakery-and-deli/30 text-category-bakery-and-deli-foreground border-category-bakery-and-deli/10",
        "Laticínios e Frios": "bg-category-dairy-and-chilled/30 text-category-dairy-and-chilled-foreground border-category-dairy-and-chilled/10",
        "Mercearia": "bg-category-pantry-and-dry-goods/30 text-category-pantry-and-dry-goods-foreground border-category-pantry-and-dry-goods/10",
        "Matinais e Doces": "bg-category-breakfast-and-snacks/30 text-category-breakfast-and-snacks-foreground border-category-breakfast-and-snacks/10",
        "Congelados": "bg-category-frozen-foods/30 text-category-frozen-foods-foreground border-category-frozen-foods/10",
        "Bebidas": "bg-category-beverages/30 text-category-beverages-foreground border-category-beverages/10",
        "Limpeza": "bg-category-cleaning-and-household/30 text-category-cleaning-and-household-foreground border-category-cleaning-and-household/10",
        "Higiene Pessoal": "bg-category-personal-care/30 text-category-personal-care-foreground border-category-personal-care/10",
        "Bebês e Crianças": "bg-category-baby-and-child-care/30 text-category-baby-and-child-care-foreground border-category-baby-and-child-care/10",
        "Pet Shop": "bg-category-pet-supplies/30 text-category-pet-supplies-foreground border-category-pet-supplies/10",
        "Utilidades e Bazar": "bg-category-home-and-general/30 text-category-home-and-general-foreground border-category-home-and-general/10",
        "Farmácia": "bg-category-pharmacy/30 text-category-pharmacy-foreground border-category-pharmacy/10",
        "Default": "bg-secondary/50 text-secondary-foreground"
    };
    return subcategoryMap[category] || subcategoryMap.Default;
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsLoading(true);
      setExtractionResult(null);
      setProducts([]);
      setDebugResult(null);

      const reader = new FileReader();
      reader.onload = async (e) => {
        const dataUri = e.target?.result as string;
        try {
          const result = await extractDataFromPdfFlow({ pdfDataUri: dataUri });
          setDebugResult(JSON.stringify(result, null, 2));
          setExtractionResult(result);
          setProducts(result.products.map((p, i) => ({
              ...p,
              id: Date.now() + i,
              price: p.price ?? p.unitPrice * p.quantity,
          })));
          toast({
              title: t('scan_success_title'),
              description: t('scan_success_desc_pdf'),
          });
        } catch (error) {
          console.error("Failed to extract data:", error);
          toast({
              variant: "destructive",
              title: t('scan_error_title'),
              description: t('scan_error_desc_pdf_detailed'),
          });
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
      };
      reader.readAsDataURL(file);
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
        barcode: "",
        name: "Novo Item",
        volume: "1 un",
        quantity: 1,
        price: 0.00,
        unitPrice: 0.00,
        category: "Mercearia",
        subcategory: "Outros",
        brand: ""
    };
    setProducts([...products, newItem]);
    handleEditClick(newItem);
  };

  const handleConfirmPurchase = async () => {
    if (extractionResult) {
        setIsSaving(true);
        try {
            await onSave(extractionResult, products);
            setExtractionResult(null);
            setProducts([]);
            setDebugResult(null);
        } catch (error) {
            // Error is handled by the parent component
        } finally {
            setIsSaving(false);
        }
    }
  }

  const triggerFileSelect = () => fileInputRef.current?.click();

  return (
    <>
        <CardContent className="flex flex-col items-center gap-8 p-0">
             <Alert>
                <FontAwesomeIcon icon={faFilePdf} />
                <AlertTitle>{t('import_from_pdf_title')}</AlertTitle>
                <AlertDescription>
                    {t('import_from_pdf_desc')}
                </AlertDescription>
            </Alert>
            
            <Input 
                type="file" 
                accept="application/pdf"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                id="pdf-upload"
            />
            <Button onClick={triggerFileSelect} className='w-full' size="lg" disabled={isLoading}>
                <FontAwesomeIcon icon={faFilePdf} className="mr-2 h-5 w-5" />
                {isLoading ? t('processing') : t('select_pdf_button')}
            </Button>


            {extractionResult && products.length > 0 && (
                <div className="w-full space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faHistory} className="w-5 h-5 text-primary" /> {t('purchase_data_title')}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faStore} className="w-4 h-4 text-muted-foreground"/>
                                    <strong>{t('store_label')}:</strong> {extractionResult.storeName}
                                </div>
                                <div className="flex items-center gap-2">
                                    <FontAwesomeIcon icon={faCalendar} className="w-4 h-4 text-muted-foreground"/>
                                    <strong>{t('date_label')}:</strong> {new Date(extractionResult.date).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}
                                </div>
                            </div>
                            
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead><FontAwesomeIcon icon={faBox} className="inline-block mr-1 w-4 h-4" /> {t('table_product')}</TableHead>
                                        <TableHead><FontAwesomeIcon icon={faCopyright} className="inline-block mr-1 w-4 h-4" /> {t('table_brand')}</TableHead>
                                        <TableHead className="w-[200px]"><FontAwesomeIcon icon={faTags} className="inline-block mr-1 w-4 h-4" /> {t('table_category')}</TableHead>
                                        <TableHead className="text-center w-[80px]"><FontAwesomeIcon icon={faHashtag} className="inline-block mr-1 w-4 h-4" /> {t('table_quantity')}</TableHead>
                                        <TableHead className="text-right w-[120px]"><FontAwesomeIcon icon={faDollarSign} className="inline-block mr-1 w-4 h-4" /> {t('table_price_header')} (R$)</TableHead>
                                        <TableHead className="text-right w-[100px]">{t('table_actions')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {products.map((product) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="font-medium">{product.name}</TableCell>
                                            <TableCell>{product.brand}</TableCell>
                                            <TableCell>
                                                <div className='flex flex-col gap-1'>
                                                    <Badge variant="tag" className={cn(getCategoryClass(product.category))}>
                                                        {product.category}
                                                    </Badge>
                                                    {product.subcategory && (
                                                        <Badge variant="tag" className={cn(getSubcategoryClass(product.category))}>
                                                            {product.subcategory}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
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
                    <CardFooter className="p-0 flex flex-col items-start gap-4">
                        <Button size="lg" onClick={handleConfirmPurchase} disabled={isSaving}>
                            <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />
                            {isSaving ? t('saving') : t('confirm_and_save_button')}
                        </Button>
                    </CardFooter>
                </div>
            )}

             {debugResult && (
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            <span className='flex items-center gap-2'><FontAwesomeIcon icon={faBug} /> Dados brutos da IA (para depuração)</span>
                        </AccordionTrigger>
                        <AccordionContent>
                            <pre className="mt-4 p-4 bg-muted rounded-md text-xs overflow-auto max-h-96">
                                {debugResult}
                            </pre>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
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
                            <Label htmlFor="name" className="text-right">{t('name_label')}</Label>
                            <Input id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand" className="text-right">{t('table_brand')}</Label>
                            <Input id="brand" value={editingProduct.brand} onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value ?? ''})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">{t('table_category')}</Label>
                            <Input id="category" value={editingProduct.category} onChange={(e) => setEditingProduct({...editingProduct, category: e.target.value ?? ''})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subcategory" className="text-right">{t('table_subcategory')}</Label>
                            <Input id="subcategory" value={editingProduct.subcategory} onChange={(e) => setEditingProduct({...editingProduct, subcategory: e.target.value ?? ''})} className="col-span-3" />
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
