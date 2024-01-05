import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { billSchema } from "../schema";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useRouter } from "next/navigation";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const router = useRouter()
  const { toast } = useToast()

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
  const IsSomeRowsSelected = table.getIsSomeRowsSelected();

  const handleGenerateExpenses = async () => {
    const { rows } = table.getSelectedRowModel();
    const parsedRows = rows.map((row) => billSchema.parse(row.original))

    await generateExpenses.mutateAsync({
      ids: parsedRows.map((row) => row.id),
      month: 1,
      year: 2024
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
      {IsSomeRowsSelected && (
        <Button
          variant="outline" size="sm" className="h-8 border-dashed"
          onClick={() => handleGenerateExpenses()}>
          Gerar Despesas
          {/* <Cross2Icon className="ml-2 h-4 w-4" /> */}
        </Button>
      )}
    </div>
  )
}