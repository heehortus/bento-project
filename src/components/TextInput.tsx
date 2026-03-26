"use client";

import { useState } from "react";

interface TextInputProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  errorText?: string;
  required?: boolean;
  state?: "normal" | "error";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  maxLength?: number;
  showCounter?: boolean;
  showHelperText?: boolean;
  showHeading?: boolean;
}

export default function TextInput({
  label = "제목",
  placeholder = "도시락 컨셉, 기억하고 싶은 한 줄 등 자유롭게 적어주세요.",
  helperText = "메시지에 마침표를 찍어요. 두 줄까지 입력할 수 있어요. 메시지에 마침표를 찍어요. 두 줄까지 입력할 수 있어요.",
  errorText = "에러 메시지를 나타내요. 에러 메시지는 한 줄까지 작성할 수 있어요.",
  required = true,
  state = "normal",
  value = "",
  onChange,
  maxLength = 50,
  showCounter = true,
  showHelperText = true,
  showHeading = true,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  const isAtLimit = maxLength !== undefined && value.length > maxLength;
  const effectiveState = state === "error" ? "error" : isAtLimit ? "error" : "normal";
  const effectiveErrorText = state === "error" ? errorText : "입력 가능한 글자 수를 초과했어요.";

  const borderClass =
    effectiveState === "error"
      ? "border-negative"
      : focused
        ? "border-positive"
        : "border-normal";

  return (
    <div className="flex flex-col gap-2 w-full">
      {showHeading && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <span className="font-sans text-[14px] font-medium leading-[20px] tracking-[-0.28px] text-foreground whitespace-nowrap">
              {label}
            </span>
            {required && (
              <span className="inline-block w-1 h-1 rounded-full bg-positive shrink-0" />
            )}
          </div>
          {showCounter && (
            <span className={`font-sans text-[12px] font-normal leading-[20px] tracking-[-0.48px] whitespace-nowrap ${isAtLimit ? "text-negative" : "text-normal"}`}>
              {value.length} / {maxLength}
            </span>
          )}
        </div>
      )}

      <div className="flex flex-col gap-1">
        <div className={`bg-white border rounded-[8px] flex items-center pl-3 pr-2 py-3 ${borderClass}`}>
          <input
            type="text"
            className="flex-1 font-sans text-[16px] font-normal leading-[20px] tracking-[-0.32px] text-foreground placeholder:text-normal bg-transparent outline-none"
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
          />
        </div>

        {effectiveState === "error" && (
          <p className="font-sans text-[12px] font-normal leading-[1.2] tracking-[-0.48px] text-negative">
            {effectiveErrorText}
          </p>
        )}
        {effectiveState === "normal" && showHelperText && (
          <p className="font-sans text-[12px] font-normal leading-[1.2] tracking-[-0.48px] text-normal pr-1">
            {helperText}
          </p>
        )}
      </div>
    </div>
  );
}
