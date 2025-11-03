'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface AnimatedToggleProps {
  options: [string, string];
  defaultSelected?: string;
  onValueChange?: (value: string) => void;
}

type ContentMeasurements = {
  [key: string]: { width: number; left: number };
};

export const AnimatedToggle = ({
  options,
  defaultSelected,
  onValueChange,
}: AnimatedToggleProps) => {
  const [selectedValue, setSelectedValue] = React.useState(
    defaultSelected || options[0]
  );
  const [measurements, setMeasurements] = React.useState<ContentMeasurements>(
    {}
  );

  const containerRef = React.useRef<HTMLDivElement>(null);
  const contentRefs = React.useRef<{ [key: string]: HTMLSpanElement | null }>(
    {}
  );

  React.useEffect(() => {
    const measureContent = () => {
      if (!containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const newMeasurements: ContentMeasurements = {};

      options.forEach((option) => {
        const contentSpan = contentRefs.current[option];
        if (contentSpan) {
          const rect = contentSpan.getBoundingClientRect();
          newMeasurements[option] = {
            width: rect.width,
            left: rect.left - containerRect.left,
          };
        }
      });
      setMeasurements(newMeasurements);
    };

    measureContent();

    window.addEventListener('resize', measureContent);
    return () => window.removeEventListener('resize', measureContent);
  }, [options]);

  const handleToggle = (value: string) => {
    setSelectedValue(value);
    if (onValueChange) {
      onValueChange(value);
    }
  };

  const PILL_PADDING_X = 12;

  const pillStyle = {
    width: measurements[selectedValue]?.width
      ? `${measurements[selectedValue].width + PILL_PADDING_X * 2}px`
      : 'auto',
    transform: measurements[selectedValue]?.left
      ? `translateX(${measurements[selectedValue].left - PILL_PADDING_X}px)`
      : 'translateX(0px)',
  };

  return (
    <div
      ref={containerRef}
      className="relative flex w-fit items-center rounded-lg bg-gray-100 p-1"
    >
      <div
        className={cn(
          'absolute top-1 h-[calc(100%-0.5rem)] rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out',
          Object.keys(measurements).length === 0 ? 'opacity-0' : 'opacity-100'
        )}
        style={pillStyle}
      />

      {options.map((option) => (
        <button
          key={option}
          onClick={() => handleToggle(option)}
          // El padding aquí solo define el área clickeable, no afecta la medición.
          className={cn(
            'relative z-10 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors duration-200',
            selectedValue === option
              ? 'text-foreground'
              : 'text-muted-foreground'
          )}
        >
          {/* El texto se envuelve en un span al que hacemos referencia. */}
          <span
            ref={(el) => {
              contentRefs.current[option] = el;
            }}
          >
            {option}
          </span>
        </button>
      ))}
    </div>
  );
};
