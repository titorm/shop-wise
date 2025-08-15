import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartBar } from "@fortawesome/free-regular-svg-icons";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/dashboard/admin/reports")({
    component: AdminReportsPage,
});

function AdminReportsPage() {
    const { t } = useTranslation();

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faChartBar} className="w-6 h-6" />
                        {t("admin_reports_title")}
                    </CardTitle>
                    <CardDescription>{t("admin_reports_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t("admin_reports_content")}</p>
                </CardContent>
            </Card>
        </div>
    );
}
