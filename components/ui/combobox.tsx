"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface ComboboxProps {
  options: {
    value: string
    label: string
  }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  searchValue?: string
  onSearchChange?: (value: string) => void
  preventFormSubmission?: boolean
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = "Select option",
  searchValue,
  onSearchChange,
  preventFormSubmission = false,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState("")

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (onSearchChange) {
      onSearchChange(value)
    }
  }

  // Prevent form submission on Enter key
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.stopPropagation()
    }
  }

  // Add a handler to prevent form submission
  const handleSelect = (currentValue: string) => {
    if (currentValue === value) {
      onChange("")
    } else {
      onChange(currentValue)
    }

    setOpen(false)

    // Prevent focus on elements that might submit the form
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      if (activeElement && activeElement.blur) {
        activeElement.blur()
      }
    }, 10)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          type="button" // Explicitly set type to button to prevent form submission
        >
          {value ? options.find((option) => option.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" onKeyDown={handleKeyDown}>
        <Command>
          <CommandInput
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchValue !== undefined ? searchValue : search}
            onValueChange={handleSearchChange}
            onKeyDown={handleKeyDown}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup className="max-h-60 overflow-auto">
              {options.map((option) => (
                <CommandItem key={option.value} value={option.value} onSelect={handleSelect} onKeyDown={handleKeyDown}>
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
