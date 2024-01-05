import { CreateBill } from "@/app/_components/create-bill";

export default function CreateBillsPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Adicionando Contas a Pagar</h2>
        <p className="text-muted-foreground">Adicione uma conta fixa mensal para pagar!</p>
      </div>
      <CreateBill />
    </div>
  )
}