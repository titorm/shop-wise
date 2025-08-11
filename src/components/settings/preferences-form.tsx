
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

const preferencesSchema = z.object({
  adults: z.coerce.number().min(1, { message: "Pelo menos um adulto é necessário." }),
  children: z.coerce.number().min(0),
  theme: z.enum(["system", "light", "dark"]),
  notifications: z.boolean(),
});

export function PreferencesForm() {
  const form = useForm<z.infer<typeof preferencesSchema>>({
    resolver: zodResolver(preferencesSchema),
    defaultValues: {
      adults: 2,
      children: 1,
      theme: "system",
      notifications: true,
    },
    mode: "onChange",
  });

  function onSubmit(values: z.infer<typeof preferencesSchema>) {
    console.log("Preferences updated:", values);
    // In a real app, you would save these preferences to the user's profile in Firestore
    form.reset(values); // This will reset the isDirty state after successful submission
  }

  const { isDirty, isValid, isSubmitting } = form.formState;


  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferências</CardTitle>
        <CardDescription>Personalize o app para suas necessidades.</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-6">
            <div>
                <h4 className="text-base font-medium mb-2">Tamanho da Família</h4>
                <p className="text-sm text-muted-foreground mb-4">
                    Isso ajuda a IA a fazer sugestões de compra mais precisas.
                </p>
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="adults"
                        render={({ field }) => (
                        <FormItem>
                            <FormLabel>Adultos</FormLabel>
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
                            <FormLabel>Crianças</FormLabel>
                            <FormControl>
                                <Input type="number" min="0" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                        )}
                    />
                </div>
            </div>

            <div>
                <h4 className="text-base font-medium mb-2">Aparência</h4>
                <FormField
                    control={form.control}
                    name="theme"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Tema</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Selecione um tema" />
                            </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                            <SelectItem value="light">Claro</SelectItem>
                            <SelectItem value="dark">Escuro</SelectItem>
                            <SelectItem value="system">Seguir o Sistema</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            
            <div>
                 <h4 className="text-base font-medium mb-2">Notificações</h4>
                <FormField
                    control={form.control}
                    name="notifications"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <FormLabel className="text-base">Notificações Push</FormLabel>
                            <p className="text-sm text-muted-foreground">
                                Receber sugestões de itens e reposição de estoque.
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
              Salvar Preferências
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
