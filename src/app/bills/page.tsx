import { Bills } from "./components/bills";
import { bills } from "./data";

export default function BillsPage() {
  return (
    <div className="flex flex-col">
      <Bills
        bills={bills}
      />
    </div>
  )
}