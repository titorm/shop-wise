import { QrScannerComponent } from "@/components/scan/qr-scanner-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ScanPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">Cadastrar Compra por Câmera</CardTitle>
                    <CardDescription>
                        Aponte a câmera para o QR Code da Nota Fiscal de Consumidor Eletrônica (NFC-e) para registrar suas compras automaticamente.
                    </CardDescription>
                </CardHeader>
                <QrScannerComponent />
            </Card>
        </div>
    );
}
