import { ShoppingListComponent } from "@/components/list/shopping-list-component";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ListPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Lista de Compras</CardTitle>
                    <CardDescription>Planeje suas compras de forma eficiente e inteligente.</CardDescription>
                </CardHeader>
                <CardContent>
                    <ShoppingListComponent />
                </CardContent>
            </Card>
        </div>
    );
}
