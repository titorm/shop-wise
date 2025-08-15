import { createFileRoute } from "@tanstack/react-router";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export const Route = createFileRoute("/dashboard/admin/settings")({
    component: AdminSettingsPage,
});

function AdminSettingsPage() {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faCog} className="w-6 h-6" />
                        {t("admin_settings_title")}
                    </CardTitle>
                    <CardDescription>{t("admin_settings_description")}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t("admin_settings_content")}</p>
                </CardContent>
            </Card>
        </div>
    );
}
