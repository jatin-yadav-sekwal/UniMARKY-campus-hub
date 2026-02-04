import { useState } from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const universities = [
    { label: "Massachusetts Institute of Technology (MIT)", value: "mit" },
    { label: "Harvard University", value: "harvard" },
    { label: "Stanford University", value: "stanford" },
    { label: "University of California, Berkeley", value: "berkeley" },
    { label: "University of Delhi", value: "du" },
    { label: "IIT Bombay", value: "iitb" },
    { label: "IIT Delhi", value: "iitd" },
    { label: "BITS Pilani", value: "bits" },
    { label: "Amity University", value: "amity" },
    { label: "Manipal University", value: "manipal" },
]

interface UniversitySelectorProps {
    value: string;
    onChange: (value: string) => void;
}

export function UniversitySelector({ value, onChange }: UniversitySelectorProps) {
    const [open, setOpen] = useState(false)

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? universities.find((framework) => framework.label === value)?.label || value
                        : "Select university..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[300px] p-0">
                <Command>
                    <CommandInput placeholder="Search university..." />
                    <CommandList>
                        <CommandEmpty>No university found.</CommandEmpty>
                        <CommandGroup heading="Featured Universities">
                            {universities.map((uni) => (
                                <CommandItem
                                    key={uni.value}
                                    value={uni.label}
                                    onSelect={(currentValue) => {
                                        onChange(currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === uni.label ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {uni.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
