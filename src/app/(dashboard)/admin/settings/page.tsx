
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                        Configurações Globais
                    </CardTitle>
                    <CardDescription>Gerencie categorias, estabelecimentos e sugestões de produtos.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Opções para configurar o comportamento geral do aplicativo estarão aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
