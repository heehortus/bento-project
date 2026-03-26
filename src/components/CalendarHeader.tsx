import Image from "next/image";
import ArrowIconSrc from "@/asset/image/Icon/Arrow.svg";

interface CalendarHeaderProps {
  year: number;
  month: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function CalendarHeader({
  year,
  month,
  onPrev,
  onNext,
}: CalendarHeaderProps) {
  const label = `${year}.${String(month).padStart(2, "0")}`;

  return (
    <div className="flex items-center justify-between w-full">
      <span className="flex-1 font-sans text-[20px] font-bold leading-[20px] tracking-[0.08px] text-foreground">
        {label}
      </span>

      <div className="flex items-center gap-4 shrink-0">
        <button
          type="button"
          onClick={onPrev}
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          aria-label="이전 달"
        >
          <Image
            src={ArrowIconSrc}
            alt=""
            width={24}
            height={24}
            unoptimized
            className="rotate-180"
          />
        </button>

        <button
          type="button"
          onClick={onNext}
          className="w-10 h-10 flex items-center justify-center cursor-pointer"
          aria-label="다음 달"
        >
          <Image
            src={ArrowIconSrc}
            alt=""
            width={24}
            height={24}
            unoptimized
          />
        </button>
      </div>
    </div>
  );
}
