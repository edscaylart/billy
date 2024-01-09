"use client"

import { BillForm } from "@/components/bills";
import { useToast } from "@/components/ui/use-toast";
import { type TBill } from "@/schemas";
import { api } from "@/trpc/react";

export default function EditBillsPage({ params }: { params: { id: string } }) {
  const { toast } = useToast();

  const utils = api.useUtils()

  const bill = api.bill.getOne.useQuery({ id: params.id }, { staleTime: Infinity, enabled: !!params.id });

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

  const onSubmit = async (values: TBill) => {
    await updateBill.mutateAsync({ ...values, id: params.id })
  }

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Editando Contas a Pagar</h2>
        <p className="text-muted-foreground">Edite uma conta fixa mensal para pagar!</p>
      </div>
      {bill.data && <BillForm bill={bill.data} isSubmitting={updateBill.isLoading} onSubmit={onSubmit} />}
    </div>
  )
}