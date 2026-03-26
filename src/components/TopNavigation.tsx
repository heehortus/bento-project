"use client";

import { useState } from "react";
import Image from "next/image";
import Logo from "@/components/Logo";
import Button from "@/components/Button";
import DropdownMenu from "@/components/DropdownMenu";
import Dialog from "@/components/Dialog";
import MenuIconSrc from "@/asset/image/Icon/Menu.svg";

interface DialogFormData {
  image: File | null;
  title: string;
  menu: string;
  companion: string;
  names: string;
}

interface TopNavigationProps {
  onBentoSubmit?: (data: DialogFormData) => Promise<void>;
}

export default function TopNavigation({ onBentoSubmit }: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const openDialog = () => {
    setIsMenuOpen(false);
    setIsDialogOpen(true);
  };

  return (
    <>
      <header className="bg-white border-b border-[#ddd] relative">
        <div className="flex items-center justify-between px-5 py-[18px]">
          <Logo variant="LogoWithLabel" />

          {/* 데스크탑 네비게이션 */}
          <nav className="hidden md:flex items-center gap-6" aria-label="주요 메뉴">
            <div className="px-1 py-2">
              <span className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground">
                도시락
              </span>
            </div>
            <div className="px-1 py-2">
              <span className="font-sans text-[14px] font-medium leading-[14px] tracking-[-0.28px] text-foreground">
                기록
              </span>
            </div>
            <Button variant="solid" size="small" label="도시락 만들기" onClick={openDialog} />
          </nav>

          {/* 모바일 햄버거 버튼 */}
          <button
            type="button"
            className="flex md:hidden items-center justify-center w-10 h-10"
            aria-label={isMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <Image src={MenuIconSrc} alt="" aria-hidden="true" width={24} height={24} unoptimized />
          </button>
        </div>

        {/* 모바일 드롭다운 */}
        {isMenuOpen && (
          <div className="absolute top-full left-0 w-full md:hidden z-50">
            <DropdownMenu onOpenDialog={openDialog} />
          </div>
        )}
      </header>

      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={async (data) => {
          await onBentoSubmit?.(data);
          setIsDialogOpen(false);
        }}
      />
    </>
  );
}
