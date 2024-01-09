"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon, PlayIcon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { billSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";
import { MonthYearSelect, type TMonthYearSelectValue } from "@/components/month-year-select";
import { useState } from "react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const { toast } = useToast()

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const [competence, setCompetence] = useState<TMonthYearSelectValue>({ month: currentMonth, year: currentYear });

  const generateExpenses = api.bill.generateExpenses.useMutation({
    onSuccess: () => {
      toast({
        title: "Despesas geradas",
        description: "As despesas foram geradas com sucesso!",
        action: (
          <ToastAction onClick={() => router.push('expenses')} altText="Despesas">
            Ir para despesas
          </ToastAction>
        ),
      })
    }
  });

  const isFiltered = table.getState().columnFilters.length > 0
  const IsRowsSelected = table.getIsSomeRowsSelected() || table.getIsAllRowsSelected();

  const handleGenerateExpenses = async () => {
    const { rows } = table.getSelectedRowModel();
    const parsedRows = rows.map((row) => billSchema.parse(row.original))

    await generateExpenses.mutateAsync({
      ids: parsedRows.map((row) => row.id!),
      ...competence
    })
  }

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Pesquisar conta..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Limpar
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>

      {IsRowsSelected ? (
        <div className="flex flex-row gap-2">
          <MonthYearSelect defaultValue={competence} onValueChange={setCompetence} />
          <Button
            className="h-9"
            variant="secondary"
            size="sm"
            onClick={() => handleGenerateExpenses()}>
            Gerar Despesas
            <PlayIcon className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button
          className="h-9"
          size="sm"
          onClick={() => router.push('bills/add')}>
          Nova conta
        </Button>
      )}
    </div>
  )
}