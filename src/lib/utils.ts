import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitials = (name: string = '', lastName: string = '') => {
  const firstNameInitial = name?.[0] || '';
  const lastNameInitial = lastName?.[0] || '';
  return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
};
