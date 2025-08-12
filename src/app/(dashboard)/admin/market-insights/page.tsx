
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";

export default function AdminMarketInsightsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <ShoppingBasket className="w-6 h-6" />
                        Insights de Mercado
                    </CardTitle>
                    <CardDescription>Análise de tendências de preços e produtos de forma agregada e anônima.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Dados sobre tendências de consumo e preços serão exibidos aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
