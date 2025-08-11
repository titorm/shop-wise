"use client";

import { useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Users, Bell, Trash2, UserX, Shield } from "lucide-react";
import { ProfileForm } from "@/components/settings/profile-form";
import { PreferencesForm } from "@/components/settings/preferences-form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "@/components/settings/delete-confirmation-dialog";


export default function SettingsPage() {
    const searchParams = useSearchParams();
    const defaultTab = searchParams.get('tab') || 'profile';

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
                    <CardTitle className="text-2xl font-headline">Configurações</CardTitle>
                    <CardDescription>Gerencie suas informações de perfil e preferências do aplicativo.</CardDescription>
                </CardHeader>
                <div className="p-6 pt-0">
                    <Tabs defaultValue={defaultTab} className="w-full">
                        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
                            <TabsTrigger value="profile"><User className="mr-2 h-4 w-4" /> Perfil</TabsTrigger>
                            <TabsTrigger value="preferences"><Users className="mr-2 h-4 w-4" /> Família & App</TabsTrigger>
                            <TabsTrigger value="privacy"><Shield className="mr-2 h-4 w-4" /> Privacidade</TabsTrigger>
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
                                    <CardTitle className="flex items-center gap-2"><Trash2 className="w-5 h-5 text-destructive" /> Apagar Dados</CardTitle>
                                    <CardDescription>Esta ação é irreversível. Todos os seus dados de compras, listas e histórico serão permanentemente excluídos.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Seu perfil e login serão mantidos, mas todo o conteúdo gerado por você será apagado.</p>
                                </CardContent>
                                <CardFooter>
                                     <DeleteConfirmationDialog 
                                        onConfirm={handleDeleteData}
                                        title="Confirmar Exclusão de Dados"
                                        description="Para confirmar, digite o código de segurança. Esta ação não pode ser desfeita."
                                        confirmButtonText="Apagar meus dados"
                                        triggerButton={
                                            <Button variant="destructive">
                                                <Trash2 className="mr-2 h-4 w-4" /> Quero apagar meus dados
                                            </Button>
                                        }
                                    />
                                </CardFooter>
                           </Card>
                           <Card className="border-destructive">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2"><UserX className="w-5 h-5 text-destructive" /> Apagar Conta</CardTitle>
                                    <CardDescription>Esta ação é final e irreversível. Sua conta e todos os dados associados serão permanentemente excluídos.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">Você perderá o acesso ao ShopWise e não poderá recuperar sua conta ou dados.</p>
                                </CardContent>
                                <CardFooter>
                                    <DeleteConfirmationDialog 
                                        onConfirm={handleDeleteAccount}
                                        title="Confirmar Exclusão da Conta"
                                        description="Para confirmar, digite o código de segurança. Esta é a sua última chance de voltar atrás."
                                        confirmButtonText="Apagar minha conta permanentemente"
                                        triggerButton={
                                            <Button variant="destructive" >
                                                <UserX className="mr-2 h-4 w-4" /> Quero apagar minha conta
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
