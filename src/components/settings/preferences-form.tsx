import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Collections } from "@/lib/enums";

import { trackEvent } from "@/services/analytics-service";
import { useLingui } from '@lingui/react/macro';

const preferencesSchema = z.object({
    theme: z.enum(["system", "light", "dark"]),
    notifications: z.boolean(),
});

type PreferencesData = z.infer<typeof preferencesSchema>;

export function PreferencesForm() {
    const { user, profile, reloadUser } = useAuth();
    const { toast } = useToast();
    const { t } = useLingui();

    const form = useForm<PreferencesData>({
        resolver: zodResolver(preferencesSchema),
        defaultValues: {
            theme: "system",
            notifications: true,
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (profile?.settings) {
            form.reset({
                theme: profile.settings.theme ?? "system",
                notifications: profile.settings.notifications ?? true,
            });
        }
    }, [profile, form]);

    async function onSubmit(values: PreferencesData) {
        if (!user) {
            toast({
                variant: "destructive",
                title: t`Erro`,
                description: t`Você precisa estar logado para salvar as preferências.`,
            });
            return;
        }
        try {
            const userRef = doc(db, Collections.Users, user.uid);
            await setDoc(userRef, { settings: values }, { merge: true });

            await reloadUser();
            form.reset(values);
            toast({
                title: t`Sucesso!`,
                description: t`Suas preferências foram salvas.`,
            });
            trackEvent("preferences_updated", values);
        } catch (error: any) {
            toast({
                variant: "destructive",
                title: t`Erro ao Salvar`,
                description: t("preferences_form_error_generic"),
            });
        }
    }

    const { isDirty, isValid, isSubmitting } = form.formState;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t`Preferências`}</CardTitle>
                <CardDescription>{t`Personalize a aparência e o comportamento do aplicativo.`}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent className="space-y-6">
                        <div>
                            <h4 className="text-base font-medium mb-2">{t`Aparência`}</h4>
                            <FormField
                                control={form.control}
                                name="theme"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{t`Tema`}</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t`Selecione um tema`}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="light">
                                                    {t`Claro`}
                                                </SelectItem>
                                                <SelectItem value="dark">{t`Escuro`}</SelectItem>
                                                <SelectItem value="system">
                                                    {t`Sistema`}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <Separator />

                        <div>
                            <h4 className="text-base font-medium mb-2">{t`Notificações`}</h4>
                            <FormField
                                control={form.control}
                                name="notifications"
                                render={({ field }) => (
                                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">
                                                {t`Ativar notificações push`}
                                            </FormLabel>
                                            <p className="text-sm text-muted-foreground">
                                                {t`Receba atualizações e sugestões.`}
                                            </p>
                                        </div>
                                        <FormControl>
                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
                            {isSubmitting ? t`Salvando...` : t`Salvar Preferências`}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
