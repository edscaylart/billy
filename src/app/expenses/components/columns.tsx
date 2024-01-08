"use client"

import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { Checkbox } from "@/components/ui/checkbox";
import { type ColumnDef } from "@tanstack/react-table"
import { type TExpense } from "../schema";
import { Badge } from "@/components/ui/badge";
import { DataTableRowActions } from "./data-table-row-actions";
import React from "react";
import { Input } from "@/components/ui/input";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<TExpense>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: "Nome",
    cell: ({ row }) => {
      const billId = row.getValue("billId");

      return (
        <div className="flex space-x-2">
          {!!billId && <Badge variant="outline">Fixa</Badge>}
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("name")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "dueDay",
    header: () => <div className="text-right">Vence Dia</div>,
    cell: ({ row }) => {
      return <div className="text-right font-medium">{row.getValue("dueDay")}</div>
    },
  },
  {
    accessorKey: "isPaid",
    header: "Pago?",
    accessorFn: (row) => row.isPaid ? 'paid' : 'notPaid',
    cell: ({ row }) => {
      return (
        <div className="flex gap-2 items-center text-right font-medium">
          {row.getValue("isPaid") === 'paid' ? (
            <>
              <CheckIcon className="text-green-400" /> Sim
            </>
          ) : (
            <>
              <Cross1Icon className="text-red-400" /> Não
            </>
          )}
        </div>
      )
    },
    filterFn: (row, id, value: string) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Valor</div>,
    cell: ({ getValue, row, column: { id }, table }) => {
      const isEditing = true;
      const initialValue = getValue()
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const [value, setValue] = React.useState(initialValue)

      const onBlur = () => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        (table.options.meta as (typeof table.options.meta) & { updateData: (index: number, id: string, value: TExpense) => void })?.updateData(row.index, id, value as TExpense)
      }

      // eslint-disable-next-line react-hooks/rules-of-hooks
      React.useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      if (!isEditing) {
        const amount = parseFloat(row.getValue("amount"))
        const formatted = new Intl.NumberFormat("pt-BR", {
          style: "currency",
          currency: "BRL",
        }).format(amount)

        return <div className="text-right font-medium">{formatted}</div>
      }

      return (
        <Input
          placeholder="500.00"
          type="number"
          value={value as string}
          onChange={e => setValue(e.target.value)}
          onBlur={onBlur}
        />
      )
    },
    footer: ({ table }) => {
      const total = table.getFilteredRowModel().rows.reduce((total, row) => total + row.getValue<number>('amount'), 0);
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(total)
      return <div className="text-right font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "billId",
    header: "Código da Conta",
    enableHiding: true,
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
