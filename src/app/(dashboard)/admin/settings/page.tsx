
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Cog } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <Cog className="w-6 h-6" />
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
