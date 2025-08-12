
"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUsers } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

export default function AdminUsersPage() {
    const { t } = useTranslation();
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <FontAwesomeIcon icon={faUsers} className="w-6 h-6" />
                        {t('admin_users_title')}
                    </CardTitle>
                    <CardDescription>{t('admin_users_description')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <p>{t('admin_users_content')}</p>
                </CardContent>
            </Card>
        </div>
    );
}

    