
import { api } from "@/trpc/server";
import { Bills } from "./components/bills";

export default async function BillsPage() {
  const bills = await api.bill.getAll.query();

  return (
    <div className="flex flex-col">
      <Bills
        bills={bills}
      />
    </div>
  )
}