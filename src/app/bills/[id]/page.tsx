import { EditBill } from "@/app/_components/edit-bill";

export default async function EditBillsPage({ params }: { params: { id: string } }) {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Editando Contas a Pagar</h2>
        <p className="text-muted-foreground">Edite uma conta fixa mensal para pagar!</p>
      </div>
      <EditBill billId={params.id} />
    </div>
  )
}