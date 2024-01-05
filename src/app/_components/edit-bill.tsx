"use client";

import { api } from "@/trpc/react";
import { BillForm, type TBillFormValues } from "../bills/components/bill-form";
import { useToast } from "@/components/ui/use-toast";

interface IEditBill {
  bill: {
    id: string;
    name: string;
    dueDay: number;
    amount: number;
    categoryId: string;
    categoryName?: string | null;
  };
}

export function EditBill({ bill }: IEditBill) {
  const { toast } = useToast()

  const updateBill = api.bill.update.useMutation()

  const onSubmit = async (values: TBillFormValues) => {
    await updateBill.mutateAsync({ id: bill.id, ...values }, {
      onSuccess: () => {
        toast({
          title: "Conta atualizada",
          description: `${values.name} foi atualizado com sucesso!`,
        })
      }
    })
  }

  return (
    <BillForm bill={bill} onSubmit={onSubmit} />
  )
}