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
    // Featured
    { label: "Central University of Haryana", value: "cuh" },
    // IITs
    { label: "IIT Bombay", value: "iitb" },
    { label: "IIT Delhi", value: "iitd" },
    { label: "IIT Madras", value: "iitm" },
    { label: "IIT Kanpur", value: "iitk" },
    { label: "IIT Kharagpur", value: "iitkgp" },
    { label: "IIT Roorkee", value: "iitr" },
    { label: "IIT Hyderabad", value: "iith" },
    // Central Universities
    { label: "University of Delhi", value: "du" },
    { label: "Jawaharlal Nehru University (JNU)", value: "jnu" },
    { label: "Banaras Hindu University (BHU)", value: "bhu" },
    { label: "Aligarh Muslim University (AMU)", value: "amu" },
    { label: "Jamia Millia Islamia", value: "jamia" },
    { label: "Central University of Punjab", value: "cup" },
    { label: "Central University of Rajasthan", value: "cur" },
    { label: "Central University of Kashmir", value: "cuk" },
    // NITs
    { label: "NIT Trichy", value: "nitt" },
    { label: "NIT Warangal", value: "nitw" },
    { label: "NIT Surathkal", value: "nitk" },
    { label: "NIT Kurukshetra", value: "nitkuk" },
    // State Universities
    { label: "Anna University", value: "anna" },
    { label: "Savitribai Phule Pune University", value: "sppu" },
    { label: "University of Mumbai", value: "mu" },
    { label: "University of Calcutta", value: "cu" },
    { label: "Osmania University", value: "ou" },
    { label: "Panjab University", value: "pu" },
    { label: "Maharshi Dayanand University (MDU)", value: "mdu" },
    { label: "Kurukshetra University", value: "kuk" },
    // Private Universities
    { label: "BITS Pilani", value: "bits" },
    { label: "Manipal Academy of Higher Education", value: "manipal" },
    { label: "Amity University", value: "amity" },
    { label: "VIT Vellore", value: "vit" },
    { label: "SRM Institute of Science and Technology", value: "srm" },
    { label: "Lovely Professional University (LPU)", value: "lpu" },
    { label: "Chandigarh University", value: "chandigarh" },
    { label: "Shiv Nadar University", value: "snu" },
    { label: "Ashoka University", value: "ashoka" },
    { label: "Thapar Institute of Engineering", value: "thapar" },
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
                                        // cmdk returns lowercase values; find the original label
                                        const originalEntry = universities.find(
                                            (u) => u.label.toLowerCase() === currentValue.toLowerCase()
                                        );
                                        onChange(originalEntry ? originalEntry.label : currentValue);
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
