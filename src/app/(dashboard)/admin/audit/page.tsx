
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicroscope } from "@fortawesome/free-solid-svg-icons";

export default function AdminAuditPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faMicroscope} className="w-6 h-6" />
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
