
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
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Collections } from "@/lib/enums";
import { useTranslation } from "react-i18next";

const familyCompositionSchema = z.object({
  adults: z.coerce.number().min(1, { message: "Pelo menos um adulto é necessário." }),
  children: z.coerce.number().min(0),
  pets: z.coerce.number().min(0),
});

type FamilyCompositionData = z.infer<typeof familyCompositionSchema>;

export function FamilyCompositionForm() {
  const { profile, reloadUser } = useAuth();
  const { toast } = useToast();
  const { t } = useTranslation();

  const form = useForm<FamilyCompositionData>({
    resolver: zodResolver(familyCompositionSchema),
    defaultValues: {
      adults: 2,
      children: 1,
      pets: 0,
    },
    mode: "onChange",
  });

  useEffect(() => {
    if (profile?.family) {
        form.reset({
            adults: profile.family.adults ?? 2,
            children: profile.family.children ?? 1,
            pets: profile.family.pets ?? 0,
        });
    }
  }, [profile, form]);


  async function onSubmit(values: FamilyCompositionData) {
    if (!profile?.familyId) {
        toast({
            variant: "destructive",
            title: t('toast_error_title'),
            description: t('preferences_form_error_not_logged_in'),
        });
        return;
    }
    try {
        const familyRef = doc(db, Collections.Families, profile.familyId);
        await setDoc(familyRef, { familyComposition: values }, { merge: true });
        
        await reloadUser();
        form.reset(values);
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
        <CardTitle>{t('preferences_form_family_size_title')}</CardTitle>
        <CardDescription>{t('preferences_form_family_size_desc')}</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
                <FormField
                    control={form.control}
                    name="adults"
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
                    name="children"
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
                    name="pets"
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
