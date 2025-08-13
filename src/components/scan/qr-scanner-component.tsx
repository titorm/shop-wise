
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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQrcode, faCamera, faHistory, faStore, faBox, faHashtag, faDollarSign, faPencil, faTrash, faShieldCheck, faPlusCircle, faSave, faXmark, faBarcode, faWeightHanging, faVideoSlash } from '@fortawesome/free-solid-svg-icons';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const [scanResult, setScanResult] = useState<ExtractProductDataOutput | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: t('toast_error_camera_title'),
          description: t('toast_error_camera_desc'),
        });
      }
    };

    getCameraPermission();
    
    return () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
        }
    }
  }, [t, toast]);


  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current || !hasCameraPermission) {
        toast({
            variant: "destructive",
            title: t('toast_error_camera_not_ready_title'),
            description: t('toast_error_camera_not_ready_desc'),
          });
        return;
    };

    setIsLoading(true);
    setScanResult(null);
    setProducts([]);
    
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d')?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    
    const base64Image = canvas.toDataURL('image/png');

    try {
        const result = await extractProductData({ receiptImage: base64Image });
        
        setScanResult(result);
        setProducts(result.products.map((p, i) => ({
            ...p,
            id: Date.now() + i,
            price: p.price ?? p.unitPrice * p.quantity,
        })));

        toast({
            title: t('scan_success_title'),
            description: t('scan_success_desc'),
        });

    } catch (error) {
        console.error("Failed to extract data:", error);
        toast({
        variant: "destructive",
        title: t('scan_error_title'),
        description: t('scan_error_desc'),
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
            <div className="w-full max-w-sm aspect-video bg-muted rounded-lg flex flex-col items-center justify-center p-4 relative overflow-hidden">
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                <canvas ref={canvasRef} className="hidden" />

                {hasCameraPermission === false && (
                     <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-4">
                        <FontAwesomeIcon icon={faVideoSlash} className="w-12 h-12 text-destructive mb-4" />
                        <AlertTitle>{t('toast_error_camera_title')}</AlertTitle>
                        <AlertDescription>{t('toast_error_camera_desc')}</AlertDescription>
                    </div>
                )}
                 {hasCameraPermission === null && (
                     <div className="absolute inset-0 bg-background/80 flex flex-col items-center justify-center text-center p-4">
                        <p>{t('loading_camera')}</p>
                    </div>
                )}
            </div>
             <Button onClick={handleScan} disabled={isLoading || hasCameraPermission !== true}>
                <FontAwesomeIcon icon={faCamera} className="mr-2 h-5 w-5" />
                {isLoading ? t('processing') : t('scan_qr_code_with_camera')}
            </Button>


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

    