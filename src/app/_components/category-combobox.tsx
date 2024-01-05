"use client"

import * as React from "react"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { api } from "@/trpc/react"
import { FormControl } from "@/components/ui/form"

interface ICategoryComboboxProps {
  value?: string;
  onValueChange: (value: string) => void;
}

export function CategoryCombobox({ value, onValueChange }: ICategoryComboboxProps) {
  const categories = api.category.getAll.useQuery();

  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn(
              "w-[200px] justify-between",
              !value && "text-muted-foreground"
            )}
          >
            {value
              ? categories.data?.find(
                (category) => category.id === value
              )?.name
              : "Selecione a categoria"}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" >
        <Command>
          <CommandInput placeholder="Buscar categoria..." className="h-9" />
          <CommandEmpty>Nenhuma categoria encontrada.</CommandEmpty>
          <CommandGroup>
            {categories.data?.map((category) => (
              <CommandItem
                key={category.id}
                value={category.name}
                onSelect={() => {
                  onValueChange(category.id)
                  setOpen(false)
                }}
              >
                {category.name}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    value === category.id ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
