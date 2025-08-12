
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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "../ui/separator";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";

const preferencesSchema = z.object({
  family: z.object({
    adults: z.coerce.number().min(1, { message: "Pelo menos um adulto é necessário." }),
    children: z.coerce.number().min(0),
    pets: z.coerce.number().min(0),
  }),
  theme: z.enum(["system", "light", "dark"]),
  notifications: z.boolean(),
});

type PreferencesData = z.infer<typeof preferencesSchema>;

export function PreferencesForm() {
  const { user } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<PreferencesData>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      family: {
        adults: 2,
        children: 1,
        pets: 0,
      },
      theme: "system",
      notifications: true,
    },
    mode: "onChange",
  });

  useEffect(() => {
    async function fetchPreferences() {
        if (user) {
            const userRef = doc(db, Collections.Profile, user.uid);
            const docSnap = await getDoc(userRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                const preferences = {
                    family: {
                      adults: data.family?.adults ?? 2,
                      children: data.family?.children ?? 1,
                      pets: data.family?.pets ?? 0,
                    },
                    theme: data.theme ?? "system",
                    notifications: data.notifications ?? true,
                }
                form.reset(preferences);
            }
        }
    }
    fetchPreferences();
  }, [user, form]);


  async function onSubmit(values: PreferencesData) {
    if (!user) {
        toast({
            variant: "destructive",
            title: t('toast_error_title'),
            description: t('preferences_form_error_not_logged_in'),
        });
        return;
    }
    try {
        const userRef = doc(db, Collections.Profile, user.uid);
        await setDoc(userRef, values, { merge: true });
        form.reset(values); // This will reset the isDirty state after successful submission
        toast({
            title: t('toast_success_title'),
            description: t('preferences_form_success_message'),
        });
    } catch (error: any) {
        toast({
            variant: "destructive",
            title: t('toast_error_saving'),
            description: t('preferences_form_error_generic'),
        });
    }
  }

  const { isDirty, isValid, isSubmitting } = form.formState;


  return (
    <Card>
      <CardHeader>
        <CardTitle>{t('preferences_form_title')}</CardTitle>
        <CardDescription>{t('preferences_form_description')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <div>
                <h4 className="text-base font-medium mb-2">{t('preferences_form_family_size_title')}</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    {t('preferences_form_family_size_desc')}
                </p>
                <div className="grid grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="family.adults"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('preferences_form_adults')}</FormLabel>
                            <FormControl>
                                <Input type="number" min="1" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="family.children"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('preferences_form_children')}</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                     <FormField
                        control={form.control}
                        name="family.pets"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>{t('preferences_form_pets')}</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            <Separator />

            <div>
                <h4 className="text-base font-medium mb-2">{t('preferences_form_appearance_title')}</h4>
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>{t('preferences_form_theme')}</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder={t('preferences_form_theme_placeholder')} />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="light">{t('preferences_form_theme_light')}</SelectItem>
                            <SelectItem value="dark">{t('preferences_form_theme_dark')}</SelectItem>
                            <SelectItem value="system">{t('preferences_form_theme_system')}</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <Separator />
            
            <div>
                 <h4 className="text-base font-medium mb-2">{t('preferences_form_notifications_title')}</h4>
                <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">{t('preferences_form_push_notifications')}</FormLabel>
                            <p className="text-sm text-muted-foreground">
                                {t('preferences_form_push_notifications_desc')}
                            </p>
                        </div>
                        <FormControl>
                            <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            />
                        </FormControl>
                        </FormItem>
                    )}
                />
            </div>

          </CardContent>
          <CardFooter>
            <Button type="submit" disabled={!isDirty || !isValid || isSubmitting}>
              {isSubmitting ? t('saving') : t('preferences_form_save_button')}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
