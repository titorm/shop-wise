
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";

export default function AdminUsersPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                        Gerenciamento de Usuários
                    </CardTitle>
                    <CardDescription>Visualize, edite, suspenda ou exclua contas de usuários.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Aqui você poderá gerenciar todos os usuários da plataforma.</p>
                </CardContent>
            </Card>
        </div>
    );
}
