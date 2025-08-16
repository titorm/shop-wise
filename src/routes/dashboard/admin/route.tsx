import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin")({
    component: AdminPage,
});

function AdminPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShieldHalved} className="w-6 h-6" />
                        {t`Painel do Administrador`}
                    </CardTitle>
                    <CardDescription>{t`Visão geral do sistema.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`Bem-vindo ao painel de administração. Aqui você pode gerenciar usuários, visualizar relatórios e configurar o sistema.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
