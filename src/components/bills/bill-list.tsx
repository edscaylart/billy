"use client"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { api } from "@/trpc/react";

export function BillList() {
  const bills = api.bill.all.useQuery(undefined, {
    refetchOnWindowFocus: true
  });

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Contas a Pagar</h2>
        <p className="text-muted-foreground">Aqui é a lista de todas as contas fixas mensais para pagar!</p>
      </div>
      <DataTable columns={columns} data={bills.data} />
    </div>
  )
}