"use client";

import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast"

import { BillForm, type TBillFormValues } from "../bills/components/bill-form";

export function CreateBill() {
  const { toast } = useToast()

  const createBill = api.bill.create.useMutation()

  const onSubmit = async (values: TBillFormValues) => {
    await createBill.mutateAsync(values, {
      onSuccess: () => {
        toast({
          title: "Conta adicionada",
          description: `${values.name} foi adicionado com sucesso!`,
        })
      }
    })
  }

  return (
    <BillForm onSubmit={onSubmit} />
  )
}