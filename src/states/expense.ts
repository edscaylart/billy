import { type TExpense } from "@/schemas";
import { observable } from "@legendapp/state"

interface IExpenseState {
  isEditing: boolean;
  selected: {
    month: number;
    year: number;
  }
  expenses: TExpense[]
}

export const expenseState$ = observable<IExpenseState>({
  isEditing: false,
  selected: {
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear()
  },
  expenses: []
})