"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
    DrawerTitle,
} from "@/components/ui/drawer";
import { VisuallyHidden } from "@/components/ui/visually-hidden";

// Hook to detect mobile screen
function useIsMobile() {
    const [isMobile, setIsMobile] = React.useState(false);

    React.useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth < 768); // md breakpoint
        };

        checkIsMobile();
        window.addEventListener("resize", checkIsMobile);
        return () => window.removeEventListener("resize", checkIsMobile);
    }, []);

    return isMobile;
}

export interface ComboboxOption {
    value: string;
    label: string;
    icon?: string;
}

interface ComboboxProps {
    options: ComboboxOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    searchPlaceholder?: string;
    emptyText?: string;
    className?: string;
    disabled?: boolean;
    renderOption?: (option: ComboboxOption) => React.ReactNode;
    renderSelected?: (option: ComboboxOption | null) => React.ReactNode;
}

export const Combobox = React.memo(
    ({
        options,
        value,
        onValueChange,
        placeholder = "Select option...",
        searchPlaceholder = "Search...",
        emptyText = "No option found.",
        className,
        disabled = false,
        renderOption,
        renderSelected,
    }: ComboboxProps) => {
        const [open, setOpen] = React.useState(false);
        const isMobile = useIsMobile();
        const selectedOption = options.find((option) => option.value === value);

        const triggerButton = (
            <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                    "w-full justify-between bg-gray-200 dark:bg-[#2A2A30] text-gray-700 dark:text-white border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-xs font-medium h-auto px-3 py-1.5 cursor-pointer",
                    !value && "text-gray-500 dark:text-gray-400",
                    className
                )}
                disabled={disabled}
            >
                {renderSelected && selectedOption
                    ? renderSelected(selectedOption)
                    : selectedOption
                    ? selectedOption.label
                    : placeholder}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
        );

        const getCommandContent = (isInDrawer: boolean = false) => (
            <Command
                className={cn(
                    "bg-white dark:bg-[#1E1F25] border-none",
                    isInDrawer && "shadow-none"
                )}
            >
                <CommandInput
                    placeholder={searchPlaceholder}
                    className="text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 border-none bg-transparent"
                />
                <CommandList
                    className={cn(
                        "bg-white dark:bg-[#1E1F25]",
                        isInDrawer && "shadow-none border-none"
                    )}
                >
                    <CommandEmpty className="text-gray-500 dark:text-gray-400">
                        {emptyText}
                    </CommandEmpty>
                    <CommandGroup
                        className={isInDrawer ? "shadow-none border-none" : ""}
                    >
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                value={option.value}
                                onSelect={(currentValue) => {
                                    onValueChange?.(
                                        currentValue === value
                                            ? ""
                                            : currentValue
                                    );
                                    setOpen(false);
                                }}
                                className="flex items-center justify-between text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
                            >
                                <div className="flex items-center flex-1 cursor-pointer">
                                    <div className="cursor-pointer">
                                        {renderOption
                                            ? renderOption(option)
                                            : option.label}
                                    </div>
                                </div>
                                <Check
                                    className={cn(
                                        "ml-2 h-4 w-4 flex-shrink-0 text-[#2D7FF9] cursor-pointer",
                                        value === option.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                    )}
                                />
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </CommandList>
            </Command>
        );

        if (isMobile) {
            return (
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>{triggerButton}</DrawerTrigger>
                    <DrawerContent className="bg-white dark:bg-[#1E1F25] shadow-none border-none">
                        <VisuallyHidden>
                            <DrawerTitle>{placeholder}</DrawerTitle>
                        </VisuallyHidden>
                        <div className="mt-4 px-0">
                            <div className="bg-white dark:bg-[#1E1F25] shadow-none border-none">
                                {getCommandContent(true)}
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            );
        }

        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>{triggerButton}</PopoverTrigger>
                <PopoverContent
                    className="w-[--radix-popover-trigger-width] max-h-[300px] p-0 bg-white dark:bg-[#1E1F25] border-gray-200 dark:border-gray-700"
                    align="start"
                >
                    {getCommandContent(false)}
                </PopoverContent>
            </Popover>
        );
    }
);
