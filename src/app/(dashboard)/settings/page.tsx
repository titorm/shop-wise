import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Palette, Bell } from "lucide-react";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
    return (
        <div className="container mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline">Configurações</CardTitle>
                    <CardDescription>Gerencie suas informações de perfil e preferências do aplicativo.</CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs defaultValue="profile" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Perfil</TabsTrigger>
                            <TabsTrigger value="preferences"><Users className="mr-2 h-4 w-4" /> Família & App</TabsTrigger>
                            <TabsTrigger value="data"><Bell className="mr-2 h-4 w-4" /> Privacidade</TabsTrigger>
                        </TabsList>
                        <TabsContent value="profile" className="mt-6">
                            <ProfileForm />
                        </TabsContent>
                        <TabsContent value="preferences" className="mt-6">
                            <PreferencesForm />
                        </TabsContent>
                        <TabsContent value="data" className="mt-6">
                           <Card>
                                <CardHeader>
                                    <CardTitle>Gestão de Dados e Privacidade</CardTitle>
                                    <CardDescription>Exporte seus dados ou exclua sua conta.</CardDescription>
                                </CardHeader>
                           </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </Card>
        </div>
    );
}
