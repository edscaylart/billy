"use client";

import { api } from "@/trpc/react";
import { MonthYearSelect } from "../month-year-select";
import { appState$ } from "@/states/app";
import { TotalCard } from "./total-card";
import { useSelector } from "@legendapp/state/react";

export default function Dashboard() {
  const competence = useSelector(appState$.competence)

  const { data } = api.dashboard.total.useQuery(competence);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <MonthYearSelect
          defaultValue={appState$.competence.get()}
          onValueChange={value => appState$.competence.set(value)}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <TotalCard title="Total Despesas" value={data?.currentMonth?.total} percentage={data?.percentageOverLastMonth ?? 0} />
        <TotalCard title="Total Pago" value={data?.currentMonth?.totalPaid} />
        <TotalCard title="Total Pendente" value={data?.currentMonth?.totalNotPaid} />
        <TotalCard title="Mês Anterior" value={data?.currentMonth?.totalNotPaid} />
      </div>
    </div>
  );
}
