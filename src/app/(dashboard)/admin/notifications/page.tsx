
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMessage } from "@fortawesome/free-solid-svg-icons";

export default function AdminNotificationsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faMessage} className="w-6 h-6" />
                        Gerenciamento de Notificações
                    </CardTitle>
                    <CardDescription>Crie e gerencie os modelos de notificações push para os usuários.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Ferramentas para o gerenciamento de notificações serão implementadas aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
