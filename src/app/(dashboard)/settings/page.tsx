
"use client";

import { useSearchParams, useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/settings/delete-confirmation-dialog";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faTrash, faUserXmark, faGear } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-regular-svg-icons';
import { useTranslation } from 'react-i18next';


export default function SettingsPage() {
    const { t } = useTranslation();
    const router = useRouter();
    const searchParams = useSearchParams();
    const tab = searchParams.get('tab') || 'profile';
    const [activeTab, setActiveTab] = useState(tab);

    useEffect(() => {
        setActiveTab(tab);
    }, [tab]);

    const handleTabChange = (value: string) => {
        setActiveTab(value);
        // Optional: update URL without reloading the page, for bookmarking/sharing
        router.push(`/settings?tab=${value}`, { scroll: false });
    };

    const handleDeleteData = async () => {
        // In a real app, you would call your backend to delete user data from the database.
        console.log("Deleting all user data...");
        // This is a placeholder for the actual API call.
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("User data deleted.");
    }

    const handleDeleteAccount = async () => {
        // In a real app, you would call firebase auth to delete the user account.
        console.log("Deleting user account...");
        // This is a placeholder for the actual API call.
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log("User account deleted.");
    }


    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">{t('settings_title')}</CardTitle>
                    <CardDescription>{t('settings_description')}</CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            <TabsTrigger value="profile"><FontAwesomeIcon icon={faUser} className="mr-2 h-4 w-4" /> {t('tab_profile')}</TabsTrigger>
                            <TabsTrigger value="preferences"><FontAwesomeIcon icon={faGear} className="mr-2 h-4 w-4" /> {t('tab_preferences')}</TabsTrigger>
                            <TabsTrigger value="privacy"><FontAwesomeIcon icon={faShieldHalved} className="mr-2 h-4 w-4" /> {t('tab_privacy')}</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-6">
                            <ProfileForm />
                        </TabsContent>
                        <TabsContent value="preferences" className="mt-6">
                            <PreferencesForm />
                        </TabsContent>
                        <TabsContent value="privacy" className="mt-6 space-y-8">
                           <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faTrash} className="w-5 h-5 text-destructive" /> {t('privacy_delete_data_title')}</CardTitle>
                                    <CardDescription>{t('privacy_delete_data_desc')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{t('privacy_delete_data_note')}</p>
                                </CardContent>
                                <CardFooter>
                                     <DeleteConfirmationDialog 
                                        onConfirm={handleDeleteData}
                                        title={t('privacy_delete_data_confirm_title')}
                                        description={t('privacy_delete_data_confirm_desc')}
                                        confirmButtonText={t('privacy_delete_data_confirm_button')}
                                        triggerButton={
                                            <Button variant="destructive">
                                                <FontAwesomeIcon icon={faTrash} className="mr-2 h-4 w-4" /> {t('privacy_delete_data_button')}
                                            </Button>
                                        }
                                    />
                                </CardFooter>
                           </Card>
                           <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><FontAwesomeIcon icon={faUserXmark} className="w-5 h-5 text-destructive" /> {t('privacy_delete_account_title')}</CardTitle>
                                    <CardDescription>{t('privacy_delete_account_desc')}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">{t('privacy_delete_account_note')}</p>
                                </CardContent>
                                <CardFooter>
                                    <DeleteConfirmationDialog 
                                        onConfirm={handleDeleteAccount}
                                        title={t('privacy_delete_account_confirm_title')}
                                        description={t('privacy_delete_account_confirm_desc')}
                                        confirmButtonText={t('privacy_delete_account_confirm_button')}
                                        triggerButton={
                                            <Button variant="destructive" >
                                                <FontAwesomeIcon icon={faUserXmark} className="mr-2 h-4 w-4" /> {t('privacy_delete_account_button')}
                                            </Button>
                                        }
                                    />
                                </CardFooter>
                           </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}

    