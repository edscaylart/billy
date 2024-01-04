import { FormControl } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { api } from "@/trpc/react";
import { type SelectProps } from "@radix-ui/react-select";

export function SelectCategory(props: SelectProps) {
  const categories = api.category.getAll.useQuery();

  return (
    <Select {...props}>
      <FormControl>
        <SelectTrigger className="w-[230px]">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
      </FormControl>
      <SelectContent>
        {categories.data?.map(category => (
          <SelectItem
            key={category.id}
            value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}