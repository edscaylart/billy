"use client"

import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SelectCategory } from "@/app/_components/select-category";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CategoryCombobox } from "@/app/_components/category-combobox";

const billFormSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  dueDay: z.coerce.number(),
  amount: z.coerce.number()
})

export type TBillFormValues = z.infer<typeof billFormSchema>

export interface IBillFormProps {
  bill?: {
    id: string;
    name: string;
    dueDay: number;
    amount: number;
    categoryId: string;
    categoryName?: string | null;
  } | null;
  isSubmitting?: boolean;
  onSubmit: (values: TBillFormValues) => Promise<void>;
}

export function BillForm({ bill, isSubmitting, onSubmit }: IBillFormProps) {
  const form = useForm<TBillFormValues>({
    resolver: zodResolver(billFormSchema),
    mode: "onChange",
    values: bill ? {
      name: bill.name,
      categoryId: bill.categoryId,
      dueDay: bill.dueDay,
      amount: bill.amount
    } : undefined,
  })

  const handleSubmit = async (data: TBillFormValues) => {
    await onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8 px-4 py-2">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input placeholder="Descrição" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Categoria</FormLabel>
              <CategoryCombobox
                value={field.value}
                onValueChange={field.onChange}
              />
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dueDay"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Vence no dia</FormLabel>
              <FormControl>
                <Input placeholder="10" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor (R$)</FormLabel>
              <FormControl>
                <Input placeholder="500.00" type="number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          ) : null}
          Salvar
        </Button>
      </form>
    </Form>
  )
}