import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { slug2label } from "@/lib/utils";

interface CheckboxGroupProps<T> {
  name: string;
  options: T[];
  valueKey: keyof T;
  labelKey: keyof T;
  defaultValue?: string[];
  className?: string;
  renderLabel?: (i: string) => string;
}

export function CheckboxGroup<T>({
  name,
  options,
  valueKey,
  labelKey,
  defaultValue = [],
  className,
  renderLabel
}: CheckboxGroupProps<T>) {
  const [values, setValues] = useState<string[]>(defaultValue);

  const toggle = (value: string) => {
    setValues((prev) =>
      prev.includes(value)
        ? prev.filter((v) => v !== value)
        : [...prev, value]
    );
  };

  return (
    <div className={className}>
      {options.map((option) => {
        const value = String(option[valueKey]);
        const checked = values.includes(value);

        return (
          <div key={value} className="flex items-center space-x-3">
            <Checkbox
              id={`${name}-${value}`}
              checked={checked}
              onCheckedChange={() => toggle(value)}
            />
            <Label className="font-normal" htmlFor={`${name}-${value}`}>
              {renderLabel ? renderLabel(String(option[labelKey])) : String(option[labelKey])}
            </Label>
          </div>
        );
      })}

      {/* Hidden inputs → form array */}
      {values.map((value) => (
        <input
          key={value}
          type="hidden"
          name={`${name}[]`}
          value={value}
        />
      ))}
    </div>
  );
}
