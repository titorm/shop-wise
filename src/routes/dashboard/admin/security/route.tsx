import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/security")({
    component: AdminSecurityPage,
});

function AdminSecurityPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShield} className="w-6 h-6" />
                        {t`Segurança`}
                    </CardTitle>
                    <CardDescription>{t`Gerencie as configurações e protocolos de segurança.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`A configuração de segurança estará aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
