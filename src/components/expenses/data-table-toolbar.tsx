import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Cross2Icon } from "@radix-ui/react-icons";
import { type Table } from "@tanstack/react-table";
import { MonthYearSelect } from "@/components/month-year-select";
import { DataTableFacetedFilter, type IDataTableFacetedFilterOptionProps } from "./data-table-faceted-filter";
import { appState$ } from "@/states/app";
import { api } from "@/trpc/react";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  const updateAmounts = api.bill.updateAmounts.useMutation()

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Pesquisar despesa..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("name")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("isPaid") && (
          <DataTableFacetedFilter
            column={table.getColumn("isPaid")}
            title="Status"
            options={statusFilter}
          />
        )}
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

      <MonthYearSelect defaultValue={appState$.competence.get()} onValueChange={value => appState$.competence.set(value)} />
      <Button
        variant="secondary"
        onClick={() => {
          updateAmounts.mutate(appState$.competence.get())
        }}
        className="h-8 px-2 lg:px-3 ml-4"
      >
        Atualizar Conta
      </Button>
    </div>
  )
}

export const statusFilter: IDataTableFacetedFilterOptionProps[] = [
  {
    label: 'Pago',
    value: 'paid',
  },
  {
    label: 'Pendente',
    value: 'notPaid'
  }
]