
"use client";

import { QrScannerComponent } from "@/components/scan/qr-scanner-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function ScanPage() {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto py-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('scan_title')}</CardTitle>
                    <CardDescription>
                        {t('scan_description')}
                    </CardDescription>
                </CardHeader>
                <QrScannerComponent />
            </Card>
        </div>
    );
}

    