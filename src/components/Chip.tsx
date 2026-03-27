interface ChipProps {
  label?: string;
  state?: "normal" | "pressed" | "disabled";
  onClick?: () => void;
}

export default function Chip({ label = "혼자", state = "normal", onClick }: ChipProps) {
  const containerClass = {
    normal: "bg-white border-normal",
    pressed: "bg-positive-subtle border-positive",
    disabled: "border-normal/16",
  }[state];

  const textClass = {
    normal: "text-normal font-normal",
    pressed: "text-foreground font-semibold",
    disabled: "text-normal/16 font-normal",
  }[state];

  return (
    <div
      onClick={onClick}
      className={`border rounded-[8px] flex items-center justify-center px-4 py-2 cursor-pointer ${containerClass}`}
    >
      <span
        className={`font-sans text-[16px] leading-[1.5] tracking-[0.128px] whitespace-nowrap ${textClass}`}
      >
        {label}
      </span>
    </div>
  );
}
