import { type TExpense } from "@/schemas";
import { observable } from "@legendapp/state"

interface IExpenseState {
  isEditing: boolean;
  expenses: TExpense[]
}

export const expenseState$ = observable<IExpenseState>({
  isEditing: false,
  expenses: []
})