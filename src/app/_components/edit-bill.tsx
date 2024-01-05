"use client";

import { api } from "@/trpc/react";
import { BillForm, type TBillFormValues } from "../bills/components/bill-form";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const { toast } = useToast()

  const updateBill = api.bill.update.useMutation()

  const onSubmit = async (values: TBillFormValues) => {
    await updateBill.mutateAsync({ id: bill.id, ...values }, {
      onSuccess: () => {
        toast({
          title: "Conta atualizada",
          description: `${values.name} foi atualizado com sucesso!`,
        })
        router.refresh()
      }
    })
  }

  return (
    <BillForm bill={bill} isSubmitting={updateBill.isLoading} onSubmit={onSubmit} />
  )
}