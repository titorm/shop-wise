import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingBasket } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/market-insights")({
    component: AdminMarketInsightsPage,
});

function AdminMarketInsightsPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShoppingBasket} className="w-6 h-6" />
                        {t`Insights de Mercado`}
                    </CardTitle>
                    <CardDescription>{t`Analise as tendências do mercado com base em dados agregados dos usuários.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`As ferramentas de análise de mercado estarão aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
