"use client";

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { QrCode, Camera, History, Store, Calendar, Package, Hash, DollarSign } from 'lucide-react';
import { extractProductData } from '@/app/(dashboard)/scan/actions';
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { useToast } from "@/hooks/use-toast";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import Image from 'next/image';

export function QrScannerComponent() {
  const [scanResult, setScanResult] = useState<ExtractProductDataOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsLoading(true);
    setScanResult(null);

    try {
      // This is a placeholder for the actual QR code data URI from a camera scan.
      // Using a minimal valid data URI as an example.
      const sampleQrCodeDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w+bOnUAAAAA//LuF9sRi9gAAAABJRU5ErkJggg==';

      const result = await extractProductData({ receiptQrCodeDataUri: sampleQrCodeDataUri });
      
      // Using mock data as the GenAI flow is not implemented for real extraction
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
      
      setScanResult(mockResult);

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


  return (
    <CardContent className="flex flex-col items-center gap-8">
      <div className="w-full max-w-sm aspect-square bg-muted rounded-lg flex flex-col items-center justify-center p-4">
        <Camera className="w-24 h-24 text-muted-foreground/50 mb-4" />
        <Button onClick={handleScan} disabled={isLoading} size="lg">
          <QrCode className="mr-2 h-5 w-5" />
          {isLoading ? "Processando..." : "Escanear QR Code"}
        </Button>
      </div>

      {scanResult && (
        <div className="w-full space-y-6">
            <h3 className="text-xl font-semibold flex items-center gap-2"><History className="w-5 h-5 text-primary" /> Dados da Compra</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                    <Store className="w-4 h-4 text-muted-foreground"/>
                    <strong>Estabelecimento:</strong> {scanResult.storeName}
                </div>
                <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground"/>
                    <strong>Data:</strong> {new Date(scanResult.date).toLocaleDateString('pt-BR')}
                </div>
            </div>
            
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead><Package className="inline-block mr-1 w-4 h-4" /> Produto</TableHead>
                        <TableHead className="text-center"><Hash className="inline-block mr-1 w-4 h-4" /> Qtd.</TableHead>
                        <TableHead className="text-right"><DollarSign className="inline-block mr-1 w-4 h-4" /> Preço (Un.)</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {scanResult.products.map((product, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-center">{product.quantity}</TableCell>
                            <TableCell className="text-right">R$ {product.price.toFixed(2)}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
      )}
    </CardContent>
  );
}
