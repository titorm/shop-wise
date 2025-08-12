
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileLines } from "@fortawesome/free-regular-svg-icons";

export default function AdminLogsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faFileLines} className="w-6 h-6" />
                        Logs do Sistema
                    </CardTitle>
                    <CardDescription>Visualize logs de erros e eventos importantes do sistema.</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>Uma interface para visualização de logs será implementada aqui.</p>
                </CardContent>
            </Card>
        </div>
    );
}
