"use client";

import { api } from "@/trpc/react";
import { BillForm, type TBillFormValues } from "../bills/components/bill-form";
import { useToast } from "@/components/ui/use-toast";

interface IEditBill {
  billId: string;
}

export function EditBill({ billId }: IEditBill) {
  const { toast } = useToast();

  const utils = api.useUtils()

  const bill = api.bill.getOne.useQuery({ id: billId }, { staleTime: Infinity, enabled: !!billId });

  const updateBill = api.bill.update.useMutation({
    onSuccess: async (_, values) => {
      toast({
        title: "Conta atualizada",
        description: `${values.name} foi atualizado com sucesso!`,
      })
    },
    onSettled: async () => {
      await utils.bill.getAll.invalidate()
    }
  })

  const onSubmit = async (values: TBillFormValues) => {
    await updateBill.mutateAsync({ id: billId, ...values })
  }

  if (bill.isLoading) return null

  return (
    <BillForm bill={bill.data} isSubmitting={updateBill.isLoading} onSubmit={onSubmit} />
  )
}