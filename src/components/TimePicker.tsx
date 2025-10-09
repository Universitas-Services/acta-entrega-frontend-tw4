// src/components/TimePicker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { FaClock } from 'react-icons/fa6';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

// Función para generar los intervalos de tiempo
const generateTimeSlots = () => {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const date = new Date();
      date.setHours(hour, minute, 0, 0);
      slots.push({
        value: format(date, 'HH:mm'),
        label: format(date, 'hh:mm a'),
      });
    }
  }
  return slots;
};

const timeSlots = generateTimeSlots();

interface ShadcnTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  className?: string;
}

export function ShadcnTimePicker({
  value,
  onChange,
  className,
}: ShadcnTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Encontrar la etiqueta (label) correspondiente al valor guardado (ej. "01:30 PM")
  const displayValue =
    timeSlots.find((slot) => slot.value === value)?.label ||
    'Seleccione una hora';

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-start text-left font-normal cursor-pointer',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <FaClock className="mr-2 h-4 w-4" />
          {displayValue}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0 bg-white">
        <Command>
          <CommandList>
            <CommandEmpty>No se encontró la hora.</CommandEmpty>
            <CommandGroup>
              {timeSlots.map((slot) => (
                <CommandItem
                  key={slot.value}
                  value={slot.value}
                  className="text-black"
                  onSelect={(currentValue) => {
                    onChange(currentValue);
                    setOpen(false);
                  }}
                >
                  {slot.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
