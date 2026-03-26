interface ButtonProps {
  cursor?: "pointer";
  label?: string;
  size?: "large" | "small";
  variant?: "solid" | "outlined";
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export default function Button({
  cursor = "pointer",
  label = "텍스트",
  size = "large",
  variant = "solid",
  onClick,
  className,
  disabled = false,
}: ButtonProps) {
  const baseClass =
    "flex items-center justify-center rounded-[8px] font-sans cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed";

  const variantClass =
    variant === "solid"
      ? "bg-positive"
      : "bg-white border border-normal";

  const sizeClass =
    size === "large"
      ? "px-[28px] py-[16px]"
      : "px-[16px] py-[12px]";

  const textClass =
    size === "large"
      ? "text-[16px] font-semibold leading-[1.2] tracking-[0.096px]"
      : "text-[14px] font-medium leading-[14px] tracking-[-0.28px]";

  return (
    <button
      type="button"
      className={`${baseClass} ${variantClass} ${sizeClass}${className ? ` ${className}` : ""}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`w-full text-center text-foreground ${textClass}`}>
        {label}
      </span>
    </button>
  );
}
