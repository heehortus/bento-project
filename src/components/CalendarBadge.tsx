interface CalendarBadgeProps {
  count: number;
}

export default function CalendarBadge({ count }: CalendarBadgeProps) {
  return (
    <div className="w-6 h-6 rounded-full bg-positive flex items-center justify-center">
      <span className="font-sans text-[12px] font-semibold leading-none text-[#181818]">
        {count}
      </span>
    </div>
  );
}
