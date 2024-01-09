"use client"

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
} from "@tanstack/react-table"
import { useSelector } from "@legendapp/state/react"

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useMemo, useState } from "react"
import { DataTableToolbar } from "./data-table-toolbar"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { CheckIcon, Cross1Icon, Pencil1Icon } from "@radix-ui/react-icons"
import { Input } from "@/components/ui/input"
import { DataTableRowActions } from "./data-table-row-actions"
import { type TExpense } from '@/schemas';
import { expenseState$ } from "@/states/expense"

interface DataTableProps<TData, TValue> {
  data?: TData[]
  onUpdateData: (row: TData, columnId: string, value: TValue) => void
}

export function DataTable<TData, TValue>({
  data = [],
  onUpdateData
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = useState({})
  const isEditing = useSelector(expenseState$.isEditing)

  const columns = useMemo<ColumnDef<TData>[]>(() => [
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
      accessorFn: (row) => (row as TExpense).isPaid ? 'paid' : 'notPaid',
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
      header: () => (
        <div className="flex flex-row items-center justify-end space-x-2">
          <span className="text-right">Valor</span>
          <div onClick={() => expenseState$.isEditing.toggle()}>
            {isEditing
              ? (<CheckIcon className="text-red-400" />)
              : (<Pencil1Icon className="text-red-400" />)}
          </div>
        </div>
      ),
      cell: ({ getValue, row, column: { id }, table }) => {
        const initialValue = getValue()
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [value, setValue] = useState(initialValue)

        const onBlur = () => {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-call
          if (String(value) !== String(row.getValue(id))) {
            (table.options.meta as (typeof table.options.meta) & { updateData: (index: number, id: string, value: TData) => void })?.updateData(row.index, id, value as TData)
          }
        }

        // eslint-disable-next-line react-hooks/rules-of-hooks
        useEffect(() => {
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
  ], [isEditing])

  const table = useReactTable({
    data,
    columns,
    state: {
      rowSelection,
      columnVisibility: { billId: false }
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    meta: {
      updateData: (rowIndex: number, columnId: string, value: TValue) => {
        if (table.getRowModel().rows[rowIndex]?.original) {
          onUpdateData(table.getRowModel().rows[rowIndex]!.original, columnId, value)
        }
      }
    }
  })

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Sem resultados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            {table.getFooterGroups().map((footerEl) => (
              <TableRow key={footerEl.id}>
                {footerEl.headers.map((columnEl) => (
                  <TableCell key={columnEl.id}>
                    {flexRender(columnEl.column.columnDef.footer, columnEl.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableFooter>
        </Table>
      </div>
    </div>
  )
}
