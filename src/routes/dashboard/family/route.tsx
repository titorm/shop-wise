import { useRouter, useSearch, createFileRoute } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers, faGem, faStore, faHistory } from "@fortawesome/free-solid-svg-icons";

import { PlanForm } from "@/components/family/plan-form";
import { FamilyCompositionForm } from "@/components/family/family-composition-form";
import { MarketsForm } from "@/components/family/markets-form";
import { HistoryTab } from "@/components/family/history-tab";
import { useLingui } from '@lingui/react/macro';

export const Route = createFileRoute("/dashboard/family")({
    component: FamilyPage,
    validateSearch: (search: Record<string, unknown>): { tab: string } => {
        return {
            tab: (search.tab as string) || "composition",
        };
    },
});

function FamilyPage() {
    const { t } = useLingui();
    const router = useRouter();
    const { tab } = useSearch({ from: Route.id });
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.navigate({ to: "/dashboard/family", search: { tab: value } });
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t`Configurações da Família`}</CardTitle>
                    <CardDescription>{t`Gerencie a composição da sua família, estabelecimentos preferidos e seu plano.`}</CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="composition">
                                <FontAwesomeIcon icon={faUsers} className="mr-2 h-4 w-4" /> {t`Composição`}
                            </TabsTrigger>
                            <TabsTrigger value="markets">
                                <FontAwesomeIcon icon={faStore} className="mr-2 h-4 w-4" /> {t`Estabelecimentos`}
                            </TabsTrigger>
                            <TabsTrigger value="history">
                                <FontAwesomeIcon icon={faHistory} className="mr-2 h-4 w-4" /> {t`Histórico de Compras`}
                            </TabsTrigger>
                            <TabsTrigger value="plan">
                                <FontAwesomeIcon icon={faGem} className="mr-2 h-4 w-4" /> {t`Plano`}
                            </TabsTrigger>
                        </TabsList>
                        <TabsContent value="composition" className="mt-6">
                            <FamilyCompositionForm />
                        </TabsContent>
                        <TabsContent value="markets" className="mt-6">
                            <MarketsForm />
                        </TabsContent>
                        <TabsContent value="history" className="mt-6">
                            <HistoryTab />
                        </TabsContent>
                        <TabsContent value="plan" className="mt-6">
                            <PlanForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
