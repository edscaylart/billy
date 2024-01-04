"use client"

import { Search } from 'lucide-react';
import { useSelector } from "@legendapp/state/react"

import { Input } from "@/components/ui/input";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Separator } from "@/components/ui/separator";
import { type TBill } from "@/server/db/schema"
import { BillList } from './bill-list';
import { BillForm, type IBillFormHandler } from './bill-form';
import { billState$ } from '../bill-observable';
import { Button } from '@/components/ui/button';
import { useRef } from 'react';

interface IBillsProps {
  bills?: {
    id: string;
    name: string;
    dueDay: number;
    amount: number;
    categoryId: string;
    categoryName: string | null;
  }[];
  defaultLayout?: number[];
}

export function Bills({ bills, defaultLayout = [440, 655] }: IBillsProps) {
  const formRef = useRef<IBillFormHandler>(null)

  const billSelected = useSelector(billState$.selected)

  return (
    <ResizablePanelGroup
      direction="horizontal"
      onLayout={(sizes: number[]) => {
        document.cookie = `react-resizable-panels:layout=${JSON.stringify(
          sizes
        )}`
      }}
      className="h-full max-h-[800px] items-stretch"
    >
      <ResizablePanel defaultSize={defaultLayout[0]} minSize={30}>
        <div className="flex items-center px-4 py-2 justify-between">
          <h1 className="text-xl font-bold">Contas a Pagar</h1>
          <Button onClick={() => {
            billState$.selected.set(undefined);
            formRef.current?.resetForm();
          }}>Novo</Button>
        </div>
        <Separator />
        <div className="bg-background/95 p-4 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <form>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Pesquisar" className="pl-8" />
            </div>
          </form>
        </div>
        <BillList bills={bills} />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize={defaultLayout[2]} minSize={30}>
        <BillForm ref={formRef} bill={bills?.find(bill => bill.id === billSelected) ?? null} />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}