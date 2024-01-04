import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { forwardRef, useEffect, useImperativeHandle } from "react";
import { SelectCategory } from "@/app/_components/select-category";
import { api } from "@/trpc/react";
import { type TBill } from "@/server/db/schema";

const billFormSchema = z.object({
  name: z.string(),
  categoryId: z.string(),
  dueDay: z.coerce.number(),
  amount: z.coerce.number()
})

type TBillFormValues = z.infer<typeof billFormSchema>

export interface IBillFormProps {
  bill?: {
    id: string;
    name: string;
    dueDay: number;
    amount: number;
    categoryId: string;
    categoryName: string | null;
  } | null;
}

export interface IBillFormHandler {
  resetForm: () => void;
}

const defaultValues: TBillFormValues = {
  name: "",
  categoryId: "",
  dueDay: 0,
  amount: 0
}

const BillForm = forwardRef<IBillFormHandler, IBillFormProps>(
  function BillForm({ bill }, ref) {
    const router = useRouter();

    const createBill = api.bill.create.useMutation({
      onSuccess: () => {
        router.refresh();
        form.reset(defaultValues);
      },
    })

    const updateBill = api.bill.update.useMutation({
      onSuccess: () => {
        router.refresh();
      },
    })

    const form = useForm<TBillFormValues>({
      resolver: zodResolver(billFormSchema),
      mode: "onChange",
      defaultValues,
    })

    useEffect(() => {
      if (bill) {
        form.reset(bill)
      }
    }, [bill])

    const onSubmit = (data: TBillFormValues) => {
      if (bill?.id) {
        updateBill.mutate({ id: bill?.id, ...data })
      } else {
        createBill.mutate(data)
      }
    }

    useImperativeHandle(ref, () => ({
      resetForm: () => form.reset(defaultValues),
    }))

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 px-4 py-2">
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
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <SelectCategory
                  value={field.value}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
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
          <Button type="submit">
            Salvar
          </Button>
        </form>
      </Form>
    )
  })

export { BillForm }