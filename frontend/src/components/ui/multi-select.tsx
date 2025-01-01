import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface Option {
  label: string
  value: number
}

interface MultiSelectProps {
  options: Option[]
  value: number[]
  onChange: (value: number[]) => void
  placeholder?: string
}

export function MultiSelect({
  options,
  value,
  onChange,
  placeholder = "Seçiniz...",
}: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const selectedLabels = options
    .filter((option) => value.includes(option.value))
    .map((option) => option.label)
    .join(", ")

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const handleSelect = (optionValue: number) => {
    const newValue = value.includes(optionValue)
      ? value.filter((v) => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedLabels || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <div className="space-y-2">
          <input
            type="text"
            placeholder="Ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border px-3 py-2 text-sm"
          />
          <div className="max-h-64 overflow-auto space-y-1">
            {filteredOptions.map((option) => (
              <div
                key={option.value}
                onClick={() => handleSelect(option.value)}
                className={cn(
                  "flex items-center px-2 py-1.5 text-sm rounded-md cursor-pointer hover:bg-accent",
                  value.includes(option.value) && "bg-accent"
                )}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value.includes(option.value) ? "opacity-100" : "opacity-0"
                  )}
                />
                {option.label}
              </div>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
} 