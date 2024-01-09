import { ExpenseList } from "@/components/expenses";

export default async function ExpensesPage() {
  return (
    <div className="h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Gerenciamento de Despesas</h2>
        <p className="text-muted-foreground">Aqui são listadas todas as despesas pendentes e pagas do mês!</p>
      </div>
      <ExpenseList />
    </div>
  )
}