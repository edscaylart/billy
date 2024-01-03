import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"

import { type TBill } from "@/server/db/schema";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

const billFormSchema = z.object({
  name: z.string(),
})

type TBillFormValues = z.infer<typeof billFormSchema>

interface IBillFormProps {
  bill?: TBill | null;
}

export function BillForm({ bill }: IBillFormProps) {
  const form = useForm<TBillFormValues>({
    resolver: zodResolver(billFormSchema),
    mode: "onChange",
  })

  useEffect(() => {
    form.reset(bill ?? {})
  }, [bill])

  const onSubmit = (data: TBillFormValues) => {
    console.log("🚀 ~ file: bill-form.tsx:22 ~ onSubmit ~ data:", data)
  }

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
        <Button type="submit">
          Salvar
        </Button>
      </form>
    </Form>
  )
}