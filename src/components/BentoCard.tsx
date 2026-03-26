"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { BentoItem } from "@/types/bento";

interface BentoCardProps {
  item: BentoItem;
}

export default function BentoCard({ item }: BentoCardProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const isTouchDevice = window.matchMedia("(hover: none)").matches;
    if (!isTouchDevice) return;

    const observer = new IntersectionObserver(
      ([entry]) => setIsActive(entry.isIntersecting),
      { threshold: 0.9 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  const companionLabel =
    item.companion === "함께" && item.names
      ? `@${item.names}`
      : item.companion === "함께"
        ? "@함께"
        : null;

  return (
    <motion.div
      whileTap={{ scale: 0.96 }}
      transition={{ duration: 0.12, ease: "easeOut" }}
    >
    <Link
      ref={ref}
      href={`/bento/${item.id}`}
      className="group relative aspect-[4/3] rounded-[8px] overflow-hidden bg-[#e0e0e0] block"
    >
      {/* 이미지 */}
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
      />

      {/* 호버 오버레이 */}
      <div
        className={`absolute inset-0 rounded-[8px] transition-opacity duration-200 flex flex-col justify-end bg-gradient-to-b from-[rgba(24,24,24,0.5)] to-[rgba(24,24,24,0.6)] pb-4 px-5 group-hover:opacity-100 ${isActive ? "opacity-100" : "opacity-0"}`}
      >
        {companionLabel && (
          <span className="font-sans text-[12px] font-normal leading-[1.4] text-[#d0d0d0] mb-1">
            {companionLabel}
          </span>
        )}
        {item.menu.length > 0 && (
          <div className="flex flex-wrap gap-x-2 mb-1">
            {item.menu.map((m, i) => (
              <span key={i} className="font-sans text-[14px] font-medium leading-[1.4] text-[#f2f2f2]">
                {m}
              </span>
            ))}
          </div>
        )}
        <span className="font-sans text-[24px] font-semibold leading-[1.2] tracking-[-0.48px] text-positive">
          {item.title}
        </span>
        <span className="font-sans text-[11px] font-medium text-[#999999] text-right mt-2">
          {item.date}
        </span>
      </div>
    </Link>
    </motion.div>
  );
}
