
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShield } from "@fortawesome/free-solid-svg-icons";

export default function AdminSecurityPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShield} className="w-6 h-6" />
                        Segurança e Conformidade
                    </CardTitle>
                    <CardDescription>Controle de acesso e auditoria de ações administrativas.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Ferramentas para gerenciamento de permissões e logs de auditoria de administradores.</p>
                </CardContent>
            </Card>
        </div>
    );
}

