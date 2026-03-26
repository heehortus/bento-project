import CalendarBadge from "@/components/CalendarBadge";

interface CalendarDayProps {
  date: number;
  active?: boolean;
  focus?: boolean;
  imageUrl?: string;
  count?: number;
  onClick?: () => void;
}

export default function CalendarDay({
  date,
  active = false,
  focus = false,
  imageUrl,
  count,
  onClick,
}: CalendarDayProps) {
  const borderClass = focus ? "border border-positive" : "";

  return (
    <button
      type="button"
      onClick={onClick}
      className={`relative w-full aspect-[88/132] rounded-[8px] overflow-hidden flex items-center justify-center cursor-pointer ${borderClass} ${!active ? "bg-background" : ""}`}
    >
      {active && imageUrl && (
        <img
          src={imageUrl}
          alt={`${date}일 도시락`}
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        />
      )}

      {!active && (
        <span className="font-sans text-[18px] font-semibold leading-[1.4] tracking-[-0.36px] text-[#dddddd] whitespace-nowrap">
          {date}
        </span>
      )}

      {active && count !== undefined && count > 1 && (
        <div className="absolute top-[4px] right-[4px]">
          <CalendarBadge count={count} />
        </div>
      )}
    </button>
  );
}
