
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShieldHalved} className="w-6 h-6" />
                        Dashboard Administrativo
                    </CardTitle>
                    <CardDescription>Visão geral e atalhos para as principais áreas de gerenciamento.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Bem-vindo à área administrativa. Use o menu lateral para navegar entre as funcionalidades.</p>
                </CardContent>
            </Card>
        </div>
    );
}
