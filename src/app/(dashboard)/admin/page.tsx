
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShieldHalved } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function AdminPage() {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faShieldHalved} className="w-6 h-6" />
                        {t('admin_dashboard_title')}
                    </CardTitle>
                    <CardDescription>{t('admin_dashboard_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t('admin_dashboard_content')}</p>
                </CardContent>
            </Card>
        </div>
    );
}

    