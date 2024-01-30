"use client"

import { useSelector } from "@legendapp/state/react"

import { api } from "@/trpc/react";
import { type TExpense } from "@/schemas";
import { useToast } from "@/components/ui/use-toast";
import { DataTable } from "./data-table";
import { appState$ } from "@/states/app";

export function ExpenseList() {
  const { toast } = useToast()
  const competence = useSelector(appState$.competence)

  const utils = api.useUtils();

  const expenses = api.expense.all.useQuery(competence, {
    refetchOnWindowFocus: true
  });

  const updateAmount = api.expense.updateAmount.useMutation({
    onMutate: async (updateEntry) => {
      await utils.expense.all.cancel();
      utils.expense.all.setData(competence, (prevEntries) => {
        if (prevEntries) {
          const index = prevEntries.findIndex((entry) => entry.id === updateEntry.id);
          if (index !== -1 && prevEntries[index]) {
            prevEntries[index]!.amount = updateEntry.amount
          }
        }
        return prevEntries;
      })
    },
    onSuccess: async () => {
      toast({
        title: `Valor atualizado!`,
        description: "O valor da conta deste mês foi atualizado!",
      })
    },
    onSettled: async () => {
      await utils.expense.all.invalidate();
    }
  });

  const handleUpdateData = (row: TExpense, columnId: string, value: unknown) => {
    if (columnId === 'amount') {
      updateAmount.mutate({ id: row.id, amount: parseFloat(value as string) })
    }
  }

  return (
    <DataTable data={expenses?.data} onUpdateData={handleUpdateData} />
  )
}