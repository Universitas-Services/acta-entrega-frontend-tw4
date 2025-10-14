'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

export interface InputCompuestoProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'value'
  > {
  value?: string;
  onChange?: (value: string) => void;
  options: string[];
  type: 'cedula' | 'rif';
}

const InputCompuesto = React.forwardRef<HTMLInputElement, InputCompuestoProps>(
  (
    { className, value = '--', onChange, options, type, name, id, ...props },
    ref
  ) => {
    const getInitialState = React.useCallback(() => {
      const parts = value.split('-');
      const prefix = options.includes(parts[0]) ? parts[0] : options[0];
      if (type === 'rif') {
        return {
          prefix,
          number1: parts[1] || '',
          number2: parts[2] || '',
        };
      }
      return { prefix, number1: parts[1] || '', number2: '' };
    }, [value, options, type]);

    const [prefix, setPrefix] = React.useState(getInitialState().prefix);
    const [number1, setNumber1] = React.useState(getInitialState().number1);
    const [number2, setNumber2] = React.useState(getInitialState().number2);

    const triggerOnChange = React.useCallback(
      (newPrefix: string, newNum1: string, newNum2: string) => {
        if (onChange) {
          const combinedValue =
            type === 'rif'
              ? `${newPrefix}-${newNum1}-${newNum2}`
              : `${newPrefix}-${newNum1}`;
          onChange(combinedValue);
        }
      },
      [onChange, type]
    );

    const handlePrefixChange = (newPrefix: string) => {
      setPrefix(newPrefix);
      triggerOnChange(newPrefix, number1, number2);
    };

    const handleNumber1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '');
      setNumber1(val);
      triggerOnChange(prefix, val, number2);
    };

    const handleNumber2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value.replace(/\D/g, '');
      setNumber2(val);
      triggerOnChange(prefix, number1, val);
    };

    React.useEffect(() => {
      const state = getInitialState();
      if (state.prefix !== prefix) setPrefix(state.prefix);
      if (state.number1 !== number1) setNumber1(state.number1);
      if (type === 'rif' && state.number2 !== number2)
        setNumber2(state.number2);
    }, [value, getInitialState, prefix, number1, number2, type]);

    if (type === 'rif') {
      return (
        <div className="flex items-center gap-2">
          <Select onValueChange={handlePrefixChange} value={prefix}>
            <SelectTrigger className="w-[70px] shrink-0 cursor-pointer">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="bg-white z-50 overflow-y-auto text-black"
            >
              {options.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            id={id}
            ref={ref}
            name={name}
            value={number1}
            onChange={handleNumber1Change}
            maxLength={8}
            placeholder=""
            className={cn('w-full max-w-[180px]', className)} // Limita el ancho máximo
            {...props}
          />
          <span className="text-xl text-gray-400 font-semibold">-</span>
          <Input
            value={number2}
            onChange={handleNumber2Change}
            maxLength={1}
            placeholder=""
            className="w-12 text-center"
          />
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2">
        <Select onValueChange={handlePrefixChange} value={prefix}>
          <SelectTrigger className="w-[70px] shrink-0 cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent
            position="popper"
            className="bg-white z-50 overflow-y-auto text-black"
          >
            {options.map((opt) => (
              <SelectItem key={opt} value={opt}>
                {opt}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="text-xl text-gray-400 font-semibold">-</span>
        <Input
          id={id}
          ref={ref}
          name={name}
          value={number1}
          onChange={handleNumber1Change}
          maxLength={8}
          placeholder=""
          className={cn('w-full max-w-[180px]', className)}
          {...props}
        />
      </div>
    );
  }
);
InputCompuesto.displayName = 'InputCompuesto';

export { InputCompuesto };
