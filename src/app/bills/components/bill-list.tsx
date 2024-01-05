import { useSelector } from "@legendapp/state/react"

import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { billState$ } from "../observable";

interface IBillListProps {
  bills?: {
    id: string;
    name: string;
    dueDay: number;
    amount: number;
    categoryId: string;
    categoryName: string | null;
  }[];
}

export function BillList({ bills }: IBillListProps) {
  const billSelected = useSelector(billState$.selected)

  return (
    <ScrollArea className="h-screen">
      <div className="flex flex-col gap-2 p-4 pt-0">
        {bills?.map((bill) => (
          <button
            key={bill.id}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent",
              billSelected === bill.id && "bg-muted"
            )}
            onClick={() => billState$.selected.set(bill.id)}
          >
            <div className="flex w-full flex-col gap-1">
              <div className="flex items-center">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{bill.name}</span>
                </div>
                <div
                  className={cn(
                    "ml-auto text-xs",
                    billSelected === bill.id
                      ? "text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  Vence todo dia {bill.dueDay}
                </div>
              </div>
              <div className="text-xs font-medium">Categoria: {bill.categoryName}</div>
            </div>
          </button>
        ))}
      </div>
    </ScrollArea>
  )
}