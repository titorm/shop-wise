
"use client";

import { ShoppingListComponent } from "@/components/list/shopping-list-component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "react-i18next";

export default function ListPage() {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('shoppingList_title')}</CardTitle>
                    <CardDescription>{t('shoppingList_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ShoppingListComponent />
                </CardContent>
            </Card>
        </div>
    );
}
