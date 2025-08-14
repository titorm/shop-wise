
"use client";

import { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { extractDataFromPdf } from '@/app/(dashboard)/scan/actions';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Input } from '../ui/input';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHistory, faStore, faBox, faHashtag, faDollarSign, faPencil, faTrash, faPlusCircle, faSave, faCopyright, faBug, faFilePdf, faTags, faTimesCircle, faSpinner } from '@fortawesome/free-solid-svg-icons';
import { faCalendar } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';
import { Badge } from '../ui/badge';
import { cn } from '@/lib/utils';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../ui/accordion';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface Product {
    id: number;
    barcode: string;
    name: string;
    volume: string;
    quantity: number;
    unitPrice: number;
    price: number;
    category?: string;
    subcategory?: string;
    brand?: string;
}

interface PdfImportProps {
    onSave: (scanResult: ExtractProductDataOutput, products: Product[]) => Promise<void>;
}

const categoriesMap: Record<string, string[]> = {
  "Hortifrúti e Ovos": ["Frutas", "Legumes", "Verduras e Folhas", "Temperos Frescos", "Ovos"],
  "Açougue e Peixaria": ["Carnes Bovinas", "Aves", "Carnes Suínas", "Peixes e Frutos do Mar"],
  "Padaria e Confeitaria": ["Pães", "Bolos e Tortas", "Salgados", "Frios e Embutidos Fatiados", "Torradas e Croutons"],
  "Laticínios e Frios": ["Leites", "Queijos", "Iogurtes", "Manteiga e Margarina", "Requeijão e Cream Cheese", "Nata e Creme de Leite Fresco"],
  "Mercearia": ["Grãos e Cereais", "Massas", "Farináceos", "Açúcar e Adoçantes", "Óleos, Azeites e Vinagres", "Enlatados e Conservas", "Molhos e Temperos", "Sopas e Cremes"],
  "Matinais e Doces": ["Café, Chás e Achocolatados em Pó", "Cereais Matinais e Granola", "Biscoitos e Bolachas", "Geleias e Cremes", "Doces e Sobremesas"],
  "Congelados": ["Pratos Prontos", "Salgados Congelados", "Legumes Congelados", "Polpas de Frutas", "Sorvetes e Açaí"],
  "Bebidas": ["Água", "Sucos", "Refrigerantes", "Chás Prontos e Isotônicos", "Bebidas Alcoólicas"],
  "Limpeza": ["Roupas", "Cozinha", "Banheiro e Geral", "Acessórios"],
  "Higiene Pessoal": ["Higiene Bucal", "Cabelo", "Corpo", "Cuidados com o Rosto", "Higiene Íntima e Absorventes", "Papel Higiênico e Lenços de Papel", "Barbearia"],
  "Bebês e Crianças": ["Fraldas e Lenços Umedecidos", "Alimentação Infantil", "Higiene Infantil"],
  "Pet Shop": ["Alimentação", "Higiene"],
  "Utilidades e Bazar": ["Cozinha", "Geral", "Churrasco"],
  "Farmácia": ["Medicamentos e Saúde", "Primeiros Socorros"],
};

const mainCategories = Object.keys(categoriesMap);


export function PdfImportComponent({ onSave }: PdfImportProps) {
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

 const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setExtractionResult(null);
    setProducts([]);
    setDebugResult(null);

    try {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async () => {
            const pdfDataUri = reader.result as string;

            const result = await extractDataFromPdf({ pdfDataUri });

            if (result.error) {
                throw new Error(result.error);
            }
            
            setDebugResult(JSON.stringify(result, null, 2));

            const finalResult: ExtractProductDataOutput = result;

            setExtractionResult(finalResult);
            setProducts(finalResult.products.map((p, idx) => ({ ...p, id: Date.now() + idx })));
            
            toast({
                title: t('scan_success_title'),
                description: t('scan_success_desc_pdf'),
            });
            setIsLoading(false);
        };
    } catch (error: any) {
        console.error("Failed to extract data:", error);
        toast({
            variant: "destructive",
            title: t('scan_error_title'),
            description: error.message || t('scan_error_desc_pdf_detailed'),
        });
        handleCancelImport();
        setIsLoading(false);
    } finally {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }
};

  const handleCancelImport = () => {
    setExtractionResult(null);
    setProducts([]);
    setDebugResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
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
        toast({ title: t('edit_item_success_toast') });
    }
  };
  
  const handleAddNewItem = () => {
    const newItem: Product = {
        id: Date.now(),
        barcode: "",
        name: "Novo Item",
        volume: "1 un",
        quantity: 1,
        unitPrice: 0.00,
        price: 0.00,
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
            handleCancelImport();
        } finally {
            setIsSaving(false);
        }
    }
  }

  const triggerFileSelect = () => fileInputRef.current?.click();
  const totalAmount = products.reduce((sum, item) => sum + item.price, 0);

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
                {isLoading ? <FontAwesomeIcon icon={faSpinner} className="mr-2 h-5 w-5 animate-spin" /> : <FontAwesomeIcon icon={faFilePdf} className="mr-2 h-5 w-5" />}
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
                                        <TableHead className="text-right w-[120px]">{t('table_unit_price')} (R$)</TableHead>
                                        <TableHead className="text-right w-[120px]">{t('table_total_price')} (R$)</TableHead>
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
                                            <TableCell className="text-right">{product.unitPrice.toFixed(2)}</TableCell>
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
                         <CardFooter className="flex-col items-end space-y-2 pt-6">
                            <p className="font-semibold text-lg">{t('total_label')}: R$ {totalAmount.toFixed(2)}</p>
                            {extractionResult.discount && extractionResult.discount > 0 && (
                                <>
                                    <p className="font-semibold text-primary text-md">{t('discounts_label')}: - R$ {extractionResult.discount.toFixed(2)}</p>
                                    <p className="font-bold text-xl text-accent">{t('total_to_pay_label')}: R$ {(totalAmount - extractionResult.discount).toFixed(2)}</p>
                                </>
                            )}
                        </CardFooter>
                    </Card>
                    <CardFooter className="p-0 flex flex-col items-start gap-4">
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1">
                                <AccordionTrigger>
                                    <span className='flex items-center gap-2'><FontAwesomeIcon icon={faBug} /> {t('debug_raw_data_title')}</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <pre className="mt-4 p-4 bg-muted rounded-md text-xs overflow-auto max-h-96">
                                        {debugResult}
                                    </pre>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex w-full justify-between items-center">
                             <Button variant="destructive" onClick={handleCancelImport} disabled={isSaving}>
                                <FontAwesomeIcon icon={faTimesCircle} className="mr-2 h-4 w-4" />
                                {t('cancel_and_new_import_button')}
                            </Button>
                            <Button size="lg" onClick={handleConfirmPurchase} disabled={isSaving}>
                                {isSaving ? <FontAwesomeIcon icon={faSpinner} className="mr-2 h-4 w-4 animate-spin" /> : <FontAwesomeIcon icon={faSave} className="mr-2 h-4 w-4" />}
                                {isSaving ? t('saving') : t('confirm_and_save_button')}
                            </Button>
                        </div>
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
                            <Label htmlFor="name" className="text-right">{t('name_label')}</Label>
                            <Input id="name" value={editingProduct.name} onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="brand" className="text-right">{t('table_brand')}</Label>
                            <Input id="brand" value={editingProduct.brand} onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value ?? ''})} className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">{t('table_category')}</Label>
                            <Select
                                value={editingProduct.category}
                                onValueChange={(value) => {
                                    setEditingProduct({
                                        ...editingProduct,
                                        category: value,
                                        subcategory: categoriesMap[value]?.[0] ?? "", // Reset subcategory
                                    });
                                }}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione a categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mainCategories.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="subcategory" className="text-right">{t('table_subcategory')}</Label>
                            <Select
                                value={editingProduct.subcategory}
                                onValueChange={(value) => setEditingProduct({ ...editingProduct, subcategory: value })}
                                disabled={!editingProduct.category || !categoriesMap[editingProduct.category] || categoriesMap[editingProduct.category].length === 0}
                            >
                                <SelectTrigger className="col-span-3">
                                    <SelectValue placeholder="Selecione a subcategoria" />
                                </SelectTrigger>
                                <SelectContent>
                                    {editingProduct.category && categoriesMap[editingProduct.category]?.map((sub) => (
                                        <SelectItem key={sub} value={sub}>{sub}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="quantity" className="text-right">{t('table_quantity')}</Label>
                            <Input id="quantity" type="number" value={editingProduct.quantity} onChange={(e) => setEditingProduct({...editingProduct, quantity: parseFloat(e.target.value) || 0})} className="col-span-3" />
                        </div>
                         <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="unitPrice" className="text-right">{t('table_unit_price')} (R$)</Label>
                            <Input id="unitPrice" type="number" value={editingProduct.unitPrice} onChange={(e) => {
                                const newUnitPrice = parseFloat(e.target.value) || 0;
                                setEditingProduct({
                                    ...editingProduct, 
                                    unitPrice: newUnitPrice,
                                    price: newUnitPrice * editingProduct.quantity,
                                })
                            }} className="col-span-3" />
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
