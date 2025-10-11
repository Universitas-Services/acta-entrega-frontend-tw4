'use client';

import {
  FormControl,
  FormField,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext, type FieldValues, type Path } from 'react-hook-form';

// Hacemos el componente genérico para que funcione con cualquier formulario
interface FormFieldWithExtrasProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  subtitle?: string;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  validationType?: 'textOnly';
  disabled?: boolean;
}

export function FormFieldWithExtras<T extends FieldValues>({
  name,
  label,
  subtitle,
  placeholder,
  type = 'text',
  maxLength,
  validationType,
  disabled = false,
}: FormFieldWithExtrasProps<T>) {
  const { control } = useFormContext<T>();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        // Creamos un manejador de cambio que no modifica el evento original
        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          let value = e.target.value;
          if (validationType === 'textOnly') {
            const regex = /[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g;
            value = value.replace(regex, '');
          }
          // Pasamos solo el valor limpio, que es la práctica correcta
          field.onChange(value);
        };

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            {subtitle && (
              <FormDescription className="italic">{subtitle}</FormDescription>
            )}
            <FormControl>
              <Input
                type={type}
                placeholder={placeholder}
                {...field}
                onChange={handleChange} // Usamos nuestro manejador seguro
                maxLength={maxLength}
                disabled={disabled}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
