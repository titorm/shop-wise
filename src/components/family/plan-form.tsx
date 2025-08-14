
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
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";
import { Badge } from "../ui/badge";
import { differenceInDays } from "date-fns";
import { PaymentButtons } from "./payment-buttons";

const planSchema = z.object({
    plan: z.enum(["free", "premium"]).default("free"),
});

type PlanFormData = z.infer<typeof planSchema>;
export type BillingCycle = "monthly" | "annually";

export function PlanForm() {
    const { profile, reloadUser } = useAuth();
    const { toast } = useToast();
    const { t } = useTranslation();
    const [isSaving, setIsSaving] = useState(false);
    const [billingCycle, setBillingCycle] = useState<BillingCycle>("monthly");

    const planFeatures = {
        free: [
            t('plan_feature_free_1'),
            t('plan_feature_free_2'),
            t('plan_feature_free_3'),
            t('plan_feature_free_4'),
        ],
        premium: [
            t('plan_feature_premium_1'),
            t('plan_feature_premium_2'),
            t('plan_feature_premium_3'),
            t('plan_feature_premium_4'),
            t('plan_feature_premium_5'),
        ]
    }

    const form = useForm<PlanFormData>({
        resolver: zodResolver(planSchema),
        defaultValues: {
            plan: "free",
        },
    });

    useEffect(() => {
        if (profile?.plan) {
            const currentPlan = profile.plan as "free" | "premium";
            form.reset({ plan: currentPlan });

            if (currentPlan === 'premium' && profile.planExpirationDate) {
                const expirationDate = profile.planExpirationDate.toDate();
                const daysRemaining = differenceInDays(expirationDate, new Date());
                if (daysRemaining > 31) {
                    setBillingCycle('annually');
                } else {
                    setBillingCycle('monthly');
                }
            }
        }
    }, [profile, form]);

    const onSubmit = async (values: PlanFormData) => {
        console.log("Upgrade plan", values, "Cycle:", billingCycle);
        // This is where you would typically handle the upgrade logic
        // with a payment provider after a successful payment from PaymentButtons.
        setIsSaving(true);
        await new Promise(res => setTimeout(res, 1500));
        setIsSaving(false);
        toast({
            title: t('toast_success_title'),
            description: t('plan_form_upgrade_success'),
        });
    };

    const handlePaymentSuccess = () => {
        // Here you would call your backend to update the user's plan
        // and then call onSubmit to reflect the change visually.
        onSubmit({ plan: 'premium' });
    }

    const selectedPlan = form.watch("plan");
    const currentPlanIsPremium = profile?.plan === 'premium';
    const showPaymentButtons = selectedPlan === 'premium' && !currentPlanIsPremium;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{t('plan_form_title')}</CardTitle>
                <CardDescription>{t('plan_form_description')}</CardDescription>
            </CardHeader>
            <Form {...form}>
                <form className="space-y-8">
                    <CardContent>
                        <FormField
                            control={form.control}
                            name="plan"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value}
                                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                                >
                                    <FormItem>
                                        <FormControl>
                                            <RadioGroupItem value="free" id="free" className="sr-only" />
                                        </FormControl>
                                        <Label htmlFor="free">
                                            <Card className={cn("cursor-pointer h-full", selectedPlan === 'free' && "border-primary ring-2 ring-primary")}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                        <span>{t('plan_form_free_title')}</span>
                                                        <span className="text-lg font-bold">{t('plan_free_price')}</span>
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
                                            <Card className={cn("cursor-pointer h-full", selectedPlan === 'premium' && "border-primary ring-2 ring-primary")}>
                                                <CardHeader>
                                                    <CardTitle className="flex items-center justify-between">
                                                         <span className="flex items-center gap-2">
                                                            <FontAwesomeIcon icon={faGem} className="w-5 h-5 text-primary" />
                                                            {t('plan_form_premium_title')}
                                                         </span>
                                                        <span className="text-lg font-bold">
                                                            {billingCycle === 'monthly' ? t('plan_premium_price_monthly') : t('plan_premium_price_annually')}
                                                        </span>
                                                    </CardTitle>
                                                    <CardDescription>{t('plan_form_premium_desc')}</CardDescription>
                                                </CardHeader>
                                                <CardContent className="space-y-4 text-sm">
                                                    <Tabs value={billingCycle} onValueChange={(value) => setBillingCycle(value as BillingCycle)} className="w-full">
                                                        <TabsList className="grid w-full grid-cols-2">
                                                            <TabsTrigger value="monthly">{t('plan_billing_monthly')}</TabsTrigger>
                                                            <TabsTrigger value="annually" className="relative group">
                                                                {t('plan_billing_annually')}
                                                                <Badge variant="outline" className="ml-2 border-primary text-primary bg-primary/10 group-data-[state=active]:bg-white group-data-[state=active]:text-primary">
                                                                    {t('plan_annual_saving')}
                                                                </Badge>
                                                            </TabsTrigger>
                                                        </TabsList>
                                                    </Tabs>
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
                         {showPaymentButtons ? (
                            <PaymentButtons
                                billingCycle={billingCycle}
                                onPaymentSuccess={handlePaymentSuccess}
                            />
                         ) : (
                            <Button type="submit" size="lg" disabled={selectedPlan === 'free' || isSaving || currentPlanIsPremium} onClick={form.handleSubmit(onSubmit)}>
                               <FontAwesomeIcon icon={faRocket} className="mr-2 h-4 w-4" />
                               {isSaving ? t('processing') : currentPlanIsPremium ? t('plan_form_current_plan_button') : t('plan_form_select_plan_button')}
                            </Button>
                         )}
                    </CardFooter>
                </form>
            </Form>
        </Card>
    );
}
