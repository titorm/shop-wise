
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faGem } from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { PlanForm } from '@/components/family/plan-form';
import { FamilyCompositionForm } from '@/components/family/family-composition-form';

export default function FamilyPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'composition';
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        router.push(`/family?tab=${value}`, { scroll: false });
    };

    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('family_settings_title')}</CardTitle>
                    <CardDescription>{t('family_settings_description')}</CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
                            <TabsTrigger value="composition"><FontAwesomeIcon icon={faUsers} className="mr-2 h-4 w-4" /> {t('tab_composition')}</TabsTrigger>
                            <TabsTrigger value="plan"><FontAwesomeIcon icon={faGem} className="mr-2 h-4 w-4" /> {t('tab_plan')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="composition" className="mt-6">
                            <FamilyCompositionForm />
                        </TabsContent>
                         <TabsContent value="plan" className="mt-6">
                            <PlanForm />
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
