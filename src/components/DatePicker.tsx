// src/components/DatePicker.tsx
'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { FaCalendarAlt } from 'react-icons/fa';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface ShadcnDatePickerProps {
  value?: Date;
  onChange: (date?: Date) => void;
  className?: string;
}

export function ShadcnDatePicker({
  value,
  onChange,
  className,
}: ShadcnDatePickerProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={'outline'}
          className={cn(
            'w-full justify-start text-left font-normal cursor-pointer',
            !value && 'text-muted-foreground',
            className
          )}
        >
          <FaCalendarAlt className="mr-2 h-4 w-4" />
          {value ? (
            format(value, 'dd/MM/yyyy', { locale: es })
          ) : (
            <span>Seleccione una fecha</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-white text-black">
        <Calendar
          mode="single"
          selected={value}
          onSelect={(date) => {
            onChange(date);
            setOpen(false);
          }}
          locale={es}
        />
      </PopoverContent>
    </Popover>
  );
}
