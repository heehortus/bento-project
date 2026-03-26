"use client";

import TopNavigation from "@/components/TopNavigation";
import Calendar from "@/components/Calendar";

export default function CalendarPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation />
      <main className="flex flex-col items-center px-5 py-8 md:px-[120px] md:py-[80px]">
        <div className="w-full max-w-[640px]">
          <Calendar />
        </div>
      </main>
    </div>
  );
}
