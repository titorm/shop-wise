
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Microscope } from "lucide-react";

export default function AdminAuditPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <Microscope className="w-6 h-6" />
                        Auditoria e Testes
                    </CardTitle>
                    <CardDescription>Acesse logs do sistema e gerencie testes A/B.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Funcionalidades de auditoria e configuração de testes A/B estarão disponíveis aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
