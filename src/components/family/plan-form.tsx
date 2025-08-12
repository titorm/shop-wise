
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useTranslation } from "react-i18next";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { cn } from "@/lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckCircle, faGem, faRocket } from "@fortawesome/free-solid-svg-icons";
import { Label } from "@/components/ui/label";

const planSchema = z.object({
    plan: z.enum(["free", "premium"]).default("free"),
});

type PlanFormData = z.infer<typeof planSchema>;

const planFeatures = {
    free: [
        "Registro de compras manual e por QR Code",
        "Histórico de compras",
        "Criação de listas de compras",
        "Dashboard com insights básicos",
    ],
    premium: [
        "Todos os recursos do plano Free",
        "Sugestões de itens por IA",
        "Análise de gastos avançada",
        "Insights de economia personalizados",
        "Suporte prioritário",
    ]
}

export function PlanForm() {
    const { profile, reloadUser } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            plan: "free",
        },
    });

    useEffect(() => {
        if (profile?.plan) {
            form.reset({ plan: profile.plan as "free" | "premium" });
        }
    }, [profile, form]);

    const onSubmit = async (values: PlanFormData) => {
        console.log("Upgrade plan", values);
        // Here you would handle the logic for upgrading a plan,
        // likely involving a payment provider like Stripe.
        setIsSaving(true);
        await new Promise(res => setTimeout(res, 1500));
        setIsSaving(false);
        toast({
            title: t('toast_success_title'),
            description: t('plan_form_upgrade_success'),
        });
    };

    const selectedPlan = form.watch("plan");

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('plan_form_title')}</CardTitle>
                <CardDescription>{t('plan_form_description')}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="plan"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="free" id="free" className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor="free">
                                            <Card className={cn("cursor-pointer", selectedPlan === 'free' && "border-primary ring-2 ring-primary")}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                        <span>{t('plan_form_free_title')}</span>
                                                        <span className="text-lg font-bold">Grátis</span>
                                                    </CardTitle>
                                                    <CardDescription>{t('plan_form_free_desc')}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-2 text-sm">
                                                    {planFeatures.free.map(feature => (
                                                        <div key={feature} className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-primary" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    </FormItem>
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="premium" id="premium" className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor="premium">
                                            <Card className={cn("cursor-pointer", selectedPlan === 'premium' && "border-primary ring-2 ring-primary")}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                         <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faGem} className="w-5 h-5 text-primary" />
                                                            {t('plan_form_premium_title')}
                                                         </span>
                                                        <span className="text-lg font-bold">R$ 19,90/mês</span>
                                                    </CardTitle>
                                                    <CardDescription>{t('plan_form_premium_desc')}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-2 text-sm">
                                                    {planFeatures.premium.map(feature => (
                                                        <div key={feature} className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faCheckCircle} className="w-4 h-4 text-primary" />
                                                            <span>{feature}</span>
                                                        </div>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </Label>
                                    </FormItem>
                                </RadioGroup>
                            )}
                        />
                    </CardContent>
                    <CardFooter>
                         <Button type="submit" size="lg" disabled={selectedPlan === 'free' || isSaving}>
                           <FontAwesomeIcon icon={faRocket} className="mr-2 h-4 w-4" />
                           {isSaving ? t('processing') : t('plan_form_upgrade_button')}
                        </Button>
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
