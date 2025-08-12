
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";

export default function AdminReportsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faChartBar} className="w-6 h-6" />
                        Relatórios de Uso
                    </CardTitle>
                    <CardDescription>Análise de dados agregados e insights sobre o uso do aplicativo.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Gráficos e métricas sobre a utilização da plataforma serão exibidos aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
