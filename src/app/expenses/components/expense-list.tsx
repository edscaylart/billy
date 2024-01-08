"use client"

import { useSelector } from "@legendapp/state/react"

import { expenseState$ } from "../observable";
import { DataTable } from "./data-table";
import { api } from "@/trpc/react";
import { type TExpense } from "../schema";
import { useToast } from "@/components/ui/use-toast";

export function ExpenseList() {
  const { toast } = useToast()
  const competence = useSelector(expenseState$.selected)

  const utils = api.useUtils();

  const expenses = api.expense.getAll.useQuery(competence, {
    refetchOnWindowFocus: true
  });

  const updateAmount = api.expense.updateAmount.useMutation({
    onMutate: async (updateEntry) => {
      await utils.expense.getAll.cancel();
      utils.expense.getAll.setData(competence, (prevEntries) => {
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
      await utils.expense.getAll.invalidate();
    }
  });

  const handleUpdateData = (row: TExpense, columnId: string, value: unknown) => {
    if (columnId === 'amount') {
      updateAmount.mutate({ id: row.id, amount: parseFloat(value as string) })
    }
  }

  return (
    <DataTable data={expenses?.data ?? []} onUpdateData={handleUpdateData} />
  )
}