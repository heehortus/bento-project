"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/Button";

interface DropdownMenuProps {
  onOpenDialog?: () => void;
  onClose?: () => void;
}

export default function DropdownMenu({ onOpenDialog, onClose }: DropdownMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="bg-background w-full px-5 py-6 flex flex-col gap-2 shadow-[0px_2px_8px_0px_rgba(0,0,0,0.08)]"
    >
      <div className="flex items-center justify-center px-1 py-2">
        <Link
          href="/"
          onClick={onClose}
          className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground whitespace-nowrap"
        >
          도시락
        </Link>
      </div>
      <div className="flex items-center justify-center px-1 py-2">
        <Link
          href="/calendar"
          onClick={onClose}
          className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground whitespace-nowrap"
        >
          기록
        </Link>
      </div>
      <Button cursor="pointer" variant="solid" size="small" label="도시락 만들기" onClick={onOpenDialog} />
    </motion.div>
  );
}
