"use client";

import { BillForm } from "@/components/bills";
import { useToast } from "@/components/ui/use-toast";
import { type TBill } from "@/schemas";
import { api } from "@/trpc/react";

export default function CreateBillsPage() {
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

  const onSubmit = async (values: TBill) => {
    await createBill.mutateAsync(values)
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Adicionando Contas a Pagar</h2>
        <p className="text-muted-foreground">Adicione uma conta fixa mensal para pagar!</p>
      </div>
      <BillForm isSubmitting={createBill.isLoading} onSubmit={onSubmit} />
    </div>
  )
}