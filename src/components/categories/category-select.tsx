import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { type SelectProps } from "@radix-ui/react-select";

export function CategorySelect(props: SelectProps) {
  const categories = api.category.all.useQuery();

  if (categories.isLoading || !categories.data?.length) {
    return <div className="flex h-9 w-[230px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
      <span>Carregando categorias...</span>
    </div>
  }

  return (
    <Select {...props}>
      <FormControl>
        <SelectTrigger className="w-[230px]">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {categories.data.map(category => (
          <SelectItem
            key={category.id}
            value={category.id.toString()}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}