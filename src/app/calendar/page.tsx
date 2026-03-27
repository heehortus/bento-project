"use client";

import TopNavigation from "@/components/TopNavigation";
import Calendar from "@/components/Calendar";
import { useBentoCreate } from "@/hooks/useBentoCreate";

export default function CalendarPage() {
  const handleBentoSubmit = useBentoCreate();

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation onBentoSubmit={handleBentoSubmit} />
      <main className="flex flex-col items-center px-5 py-8 md:px-[120px] md:py-[80px]">
        <div className="w-full max-w-[640px]">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
