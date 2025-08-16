import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/logs")({
    component: AdminLogsPage,
});

function AdminLogsPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileLines} className="w-6 h-6" />
                        {t`Logs do Sistema`}
                    </CardTitle>
                    <CardDescription>{t`Visualize os logs do sistema e da aplicação.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`O visualizador de logs estará aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
