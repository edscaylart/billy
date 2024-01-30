import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { type Row } from "@tanstack/react-table"
import { expenseSchema } from "@/schemas";
import { api } from "@/trpc/react";
import { useToast } from "@/components/ui/use-toast";
import { appState$ } from "@/states/app";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { toast } = useToast()

  const utils = api.useUtils()

  const expense = expenseSchema.parse(row.original)

  const markAsPaid = api.expense.markAsPaid.useMutation({
    onMutate: async (updateEntry) => {
      await utils.expense.all.cancel()
      utils.expense.all.setData(appState$.competence.get(), (prevEntries) => {
        if (prevEntries) {
          const index = prevEntries.findIndex((entry) => entry.id === updateEntry.id)
          if (index !== -1 && prevEntries[index]) {
            prevEntries[index]!.isPaid = true
          }
        }
        return prevEntries
      })
    },
    onSuccess: async () => {
      toast({
        title: `${expense.name} pago!`,
        description: "Ufa! Uma despesa a menos esse mês!",
      })
    }
  })

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <DotsHorizontalIcon className="h-4 w-4" />
          <span className="sr-only">Abrir Menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          Editar
        </DropdownMenuItem>
        <DropdownMenuItem disabled={markAsPaid.isLoading} onClick={() => markAsPaid.mutate({ id: expense.id })}>
          Marcar como pago
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}