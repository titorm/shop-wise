
"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlusCircle, faTrash, faSave, faStore, faBox, faHashtag, faDollarSign, faBarcode, faWeightHanging, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const itemSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  quantity: z.coerce.number().min(0.01, "Quantidade deve ser maior que 0"),
  price: z.coerce.number().min(0, "Preço não pode ser negativo"),
  barcode: z.string().optional(),
  volume: z.string().optional(),
});

const purchaseSchema = z.object({
  storeName: z.string().min(1, "Nome da loja é obrigatório"),
  date: z.date({ required_error: "Data é obrigatória" }),
  items: z.array(itemSchema).min(1, "Adicione pelo menos um item"),
});

export type PurchaseData = z.infer<typeof purchaseSchema>;
type ItemData = z.infer<typeof itemSchema>;

interface ManualPurchaseFormProps {
  onSave: (data: PurchaseData, products: ItemData[]) => Promise<void>;
}

export function ManualPurchaseForm({ onSave }: ManualPurchaseFormProps) {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);

  const form = useForm<PurchaseData>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: {
      storeName: "",
      date: new Date(),
      items: [{ name: "", quantity: 1, price: 0, barcode: "", volume: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const onSubmit = async (data: PurchaseData) => {
    setIsSaving(true);
    await onSave(data, data.items);
    setIsSaving(false);
  };

  const totalAmount = form.watch("items").reduce((acc, item) => {
    return acc + (item.price || 0) * (item.quantity || 0);
  }, 0);


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('manual_entry_purchase_details_title')}</CardTitle>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="storeName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel><FontAwesomeIcon icon={faStore} className="mr-2" /> {t('store_name_label')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('store_name_placeholder')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel><FontAwesomeIcon icon={faCalendarAlt} className="mr-2" /> {t('date_label')}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP", { locale: ptBR })
                          ) : (
                            <span>{t('date_placeholder')}</span>
                          )}
                          <FontAwesomeIcon icon={faCalendarAlt} className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('manual_entry_items_title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[30%]"><FontAwesomeIcon icon={faBox} className="mr-2" />{t('table_product')}</TableHead>
                  <TableHead><FontAwesomeIcon icon={faWeightHanging} className="mr-2" />{t('table_volume')}</TableHead>
                  <TableHead><FontAwesomeIcon icon={faHashtag} className="mr-2" />{t('table_quantity')}</TableHead>
                  <TableHead><FontAwesomeIcon icon={faDollarSign} className="mr-2" />{t('table_unit_price')}</TableHead>
                  <TableHead className="text-right">{t('table_actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fields.map((field, index) => (
                  <TableRow key={field.id}>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.name`}
                        render={({ field }) => (
                          <Input {...field} placeholder={t('item_name_placeholder')} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.volume`}
                        render={({ field }) => (
                          <Input {...field} placeholder="ex: 1kg, 500ml" />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormField
                        control={form.control}
                        name={`items.${index}.quantity`}
                        render={({ field }) => (
                          <Input type="number" step="0.01" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell>
                       <FormField
                        control={form.control}
                        name={`items.${index}.price`}
                        render={({ field }) => (
                          <Input type="number" step="0.01" {...field} />
                        )}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 1}
                      >
                        <FontAwesomeIcon icon={faTrash} className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <FormMessage>{form.formState.errors.items?.root?.message}</FormMessage>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => append({ name: "", quantity: 1, price: 0, barcode: "", volume: "" })}
            >
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" /> {t('add_item_button')}
            </Button>
          </CardContent>
          <CardFooter className="flex justify-end font-bold text-lg">
             <span>{t('total_label')}: R$ {totalAmount.toFixed(2)}</span>
          </CardFooter>
        </Card>
        
        <div className="flex justify-end">
            <Button type="submit" size="lg" disabled={isSaving}>
                <FontAwesomeIcon icon={faSave} className="mr-2" /> 
                {isSaving ? t('saving') : t('save_purchase_button')}
            </Button>
        </div>
      </form>
    </Form>
  );
}
