import Button from "@/components/Button";

interface DropdownMenuProps {
  onOpenDialog?: () => void;
}

export default function DropdownMenu({ onOpenDialog }: DropdownMenuProps) {
  return (
    <div className="bg-background w-full px-5 py-6 flex flex-col gap-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]">
      <div className="flex items-center justify-center px-1 py-2">
        <span className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground whitespace-nowrap">
          도시락
        </span>
      </div>
      <div className="flex items-center justify-center px-1 py-2">
        <span className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground whitespace-nowrap">
          기록
        </span>
      </div>
      <Button cursor="pointer" variant="solid" size="small" label="도시락 만들기" onClick={onOpenDialog} />
    </div>
  );
}
