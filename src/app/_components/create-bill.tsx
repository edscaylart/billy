"use client";

import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast"

import { BillForm, type TBillFormValues } from "../bills/components/bill-form";

export function CreateBill() {
  const { toast } = useToast()

  const utils = api.useUtils()

  const createBill = api.bill.create.useMutation({
    onSuccess: (_, values) => {
      toast({
        title: "Conta adicionada",
        description: `${values.name} foi adicionado com sucesso!`,
      })
    },
    onSettled: async () => {
      await utils.bill.getAll.invalidate()
    }
  })

  const onSubmit = async (values: TBillFormValues) => {
    await createBill.mutateAsync(values)
  }

  return (
    <BillForm isSubmitting={createBill.isLoading} onSubmit={onSubmit} />
  )
}