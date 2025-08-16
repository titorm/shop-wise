import { createFileRoute } from "@tanstack/react-router";
import { ShoppingListComponent } from "@/components/list/shopping-list-component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/list")({
    component: ListPage,
});

function ListPage() {
    const { t } = useLingui();

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t`Lista de Compras`}</CardTitle>
                    <CardDescription>{t`Gerencie sua lista de compras ativa. Adicione, remova e marque itens.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <ShoppingListComponent />
                </CardContent>
            </Card>
        </div>
    );
}
