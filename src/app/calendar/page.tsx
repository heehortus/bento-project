"use client";

import { useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import Calendar from "@/components/Calendar";
import Chip from "@/components/Chip";
import { useBentoCreate } from "@/hooks/useBentoCreate";
import { useCalendarData, CalendarMode } from "@/hooks/useCalendarData";
import { useAuth } from "@/hooks/useAuth";

export default function CalendarPage() {
  const { user } = useAuth();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [mode, setMode] = useState<CalendarMode>("mine");

  const { dayMap, addEntry } = useCalendarData(year, month, user?.id ?? null, mode);

  const handleBentoSubmit = useBentoCreate(({ inserted, imageUrl }) => {
    addEntry(String(inserted.id), imageUrl || null, inserted.created_at);
  });

  const handlePrev = () => {
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };

  const handleNext = () => {
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation onBentoSubmit={handleBentoSubmit} />
      <main className="flex flex-col items-center px-5 py-10 md:px-[120px] md:py-[40px]">
        <div className="flex flex-col gap-6 w-full max-w-[640px]">
          {/* 필터 */}
          <div className="flex gap-2 items-center">
            <Chip
              label="내 기록"
              state={mode === "mine" ? "pressed" : "normal"}
              onClick={() => setMode("mine")}
            />
            <Chip
              label="좋아요"
              state={mode === "liked" ? "pressed" : "normal"}
              onClick={() => setMode("liked")}
            />
          </div>

          <Calendar
            year={year}
            month={month}
            dayMap={dayMap}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
      </main>
    </div>
  );
}
