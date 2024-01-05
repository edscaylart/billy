"use client"

import { DataTable } from "./data-table";
import { columns } from "./columns";
import { api } from "@/trpc/react";

export function BillList() {
  const bills = api.bill.getAll.useQuery(undefined, {
    refetchOnWindowFocus: true
  });

  return (
    <DataTable columns={columns} data={bills.data ?? []} />
  )
}