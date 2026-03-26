"use client";

import { useState } from "react";
import Chip from "@/components/Chip";

interface SelectInputProps {
  label?: string;
  options?: string[];
  value?: string;
  onChange?: (value: string) => void;
}

export default function SelectInput({
  label = "도시락 시간을 함께 한 사람이 있나요?",
  options = ["혼자", "함께"],
  value,
  onChange,
}: SelectInputProps) {
  const [internal, setInternal] = useState<string>(options[0]);

  const selected = value ?? internal;

  const handleSelect = (option: string) => {
    if (onChange) {
      onChange(option);
    } else {
      setInternal(option);
    }
  };

  return (
    <div className="flex flex-col gap-2 items-start">
      <p className="font-sans text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-foreground">
        {label}
      </p>
      <div className="flex gap-2 items-center">
        {options.map((option) => (
          <button key={option} type="button" onClick={() => handleSelect(option)}>
            <Chip label={option} state={selected === option ? "pressed" : "normal"} />
          </button>
        ))}
      </div>
    </div>
  );
}
