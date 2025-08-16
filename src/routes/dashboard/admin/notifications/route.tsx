import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/notifications")({
    component: AdminNotificationsPage,
});

function AdminNotificationsPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faMessage} className="w-6 h-6" />
                        {t`Gerenciar Notificações`}
                    </CardTitle>
                    <CardDescription>{t`Envie e gerencie notificações globais.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`As ferramentas de gerenciamento de notificações estarão aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
