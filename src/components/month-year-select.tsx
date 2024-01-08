import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export type TMonthYearSelectValue = { month: number; year: number };

interface IMonthYearSelectProps {
  defaultValue: TMonthYearSelectValue;
  onValueChange: (value: TMonthYearSelectValue) => void;
}

const months = [
  { value: "1", label: "Janeiro" },
  { value: "2", label: "Fevereiro" },
  { value: "3", label: "Março" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Maio" },
  { value: "6", label: "Junho" },
  { value: "7", label: "Julho" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Setembro" },
  { value: "10", label: "Outubro" },
  { value: "11", label: "Novembro" },
  { value: "12", label: "Dezembro" },
];

const years: { value: string }[] = [];
const currentYear = new Date().getFullYear();
for (let i = currentYear - 6; i <= currentYear + 1; i++) {
  years.push({ value: i.toString() });
}

export function MonthYearSelect({
  defaultValue,
  onValueChange
}: IMonthYearSelectProps) {
  const [selectedMonth, setSelectedMonth] = useState(defaultValue.month.toString());
  const [selectedYear, setSelectedYear] = useState(defaultValue.year.toString());

  const handleChangeMonth = (value: string) => {
    setSelectedMonth(value);
    onValueChange({ month: parseInt(value), year: parseInt(selectedYear) });
  }

  const handleChangeYear = (value: string) => {
    setSelectedYear(value);
    onValueChange({ month: parseInt(selectedMonth), year: parseInt(value) });
  }

  return (
    <div className="flex flex-row gap-2">
      <Select value={selectedMonth} onValueChange={handleChangeMonth}>
        <SelectTrigger className="w-[140px]">
          <SelectValue placeholder="Mês" />
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem
              key={month.value}
              value={month.value}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={selectedYear} onValueChange={handleChangeYear}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Ano" />
        </SelectTrigger>
        <SelectContent>
          {years.map(month => (
            <SelectItem
              key={month.value}
              value={month.value}>
              {month.value}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}