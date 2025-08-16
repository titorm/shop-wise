import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/settings")({
    component: AdminSettingsPage,
});

function AdminSettingsPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                        {t`Configurações Globais`}
                    </CardTitle>
                    <CardDescription>{t`Configure as definições de toda a aplicação.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`As opções de configuração global estarão aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
