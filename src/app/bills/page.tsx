import { api } from "@/trpc/server";
import { BillDataTable } from "./components/data-table";
import { columns } from "./components/columns";

export default async function BillsPage() {
  const data = await api.bill.getAll.query();

  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Contas a Pagar</h2>
        <p className="text-muted-foreground">Aqui é a lista de todas as contas fixas mensais para pagar!</p>
      </div>
      <BillDataTable columns={columns} data={data} />
    </div>
  )
}