
"use client";

import { PdfImportComponent } from "@/components/scan/pdf-import-component";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";
import { useAuth } from '@/hooks/use-auth';
import { savePurchase } from "./actions";
import type { ExtractProductDataOutput } from '@/ai/flows/extract-product-data';
import { ManualPurchaseForm } from "@/components/scan/manual-purchase-form";
import type { PurchaseData, ItemData } from "@/components/scan/manual-purchase-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKeyboard, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export const dynamic = 'force-dynamic';

export default function ScanPage() {
    const { t } = useTranslation();
    const { user, profile } = useAuth();
    const { toast } = useToast();

    const handleSavePurchase = async (purchaseData: ExtractProductDataOutput | PurchaseData, products: any[], entryMethod: 'import' | 'manual') => {
        if (!user || !profile || !profile.familyId) {
            toast({
                variant: 'destructive',
                title: t('toast_error_title'),
                description: t('error_not_logged_in'),
            });
            return;
        }

        const result = await savePurchase(purchaseData, products, profile.familyId, user.uid, entryMethod);

        if (result.error) {
             toast({
                variant: 'destructive',
                title: t('toast_error_saving'),
                description: result.error,
            });
        } else {
             toast({
                title: t('toast_success_title'),
                description: t('purchase_saved_successfully'),
            });
        }
    };


    return (
        <div className="container mx-auto py-8">
            <Card>
                 <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('add_purchase_title')}</CardTitle>
                    <CardDescription>
                        {t('add_purchase_description')}
                    </CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs defaultValue="scan" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="scan"><FontAwesomeIcon icon={faFilePdf} className="mr-2 h-4 w-4" /> {t('import_from_pdf_tab')}</TabsTrigger>
                            <TabsTrigger value="manual"><FontAwesomeIcon icon={faKeyboard} className="mr-2 h-4 w-4" /> {t('manual_entry_tab')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="scan" className="mt-6">
                            <PdfImportComponent onSave={(data, prods) => handleSavePurchase(data, prods, 'import')} />
                        </TabsContent>
                        <TabsContent value="manual" className="mt-6">
                            <ManualPurchaseForm onSave={(data, prods) => handleSavePurchase(data, prods, 'manual')} />
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
