import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield } from "lucide-react";

export default function AdminPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <Shield className="w-6 h-6" />
                        Painel Administrativo
                    </CardTitle>
                    <CardDescription>Gerencie as configurações e dados do aplicativo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Bem-vindo à área administrativa. Funcionalidades futuras serão adicionadas aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
