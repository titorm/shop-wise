import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useLingui } from '@lingui/react/macro';


export const Route = createFileRoute("/dashboard/admin/users")({
    component: AdminUsersPage,
});

function AdminUsersPage() {
    const { t } = useLingui();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                        {t`Gerenciar Usuários`}
                    </CardTitle>
                    <CardDescription>{t`Visualize e gerencie todos os usuários registrados.`}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t`A interface de gerenciamento de usuários estará aqui.`}</p>
                </CardContent>
            </Card>
        </div>
    );
}
