"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import CalendarHeader from "@/components/CalendarHeader";
import CalendarDay from "@/components/CalendarDay";
import { supabase } from "@/lib/supabase";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

interface BentoRecord {
  ids: string[];
  image_url: string | null;
}

type DayMap = Record<number, BentoRecord>;

function buildGrid(year: number, month: number): (number | null)[] {
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: lastDate }, (_, i) => i + 1),
  ];
  const remainder = cells.length % 7;
  if (remainder !== 0) {
    cells.push(...Array(7 - remainder).fill(null));
  }
  return cells;
}

export default function Calendar() {
  const router = useRouter();
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [dayMap, setDayMap] = useState<DayMap>({});
  const direction = useRef<1 | -1>(1);

  useEffect(() => {
    const from = new Date(year, month - 1, 1).toISOString();
    const to = new Date(year, month, 1).toISOString();

    supabase
      .from("bento")
      .select("id, image_url, created_at")
      .gte("created_at", from)
      .lt("created_at", to)
      .then(({ data }) => {
        if (!data) return;
        const map: DayMap = {};
        data.forEach((row) => {
          const day = new Date(row.created_at).getDate();
          if (!map[day]) {
            map[day] = { ids: [String(row.id)], image_url: row.image_url };
          } else {
            map[day].ids.push(String(row.id));
          }
        });
        setDayMap(map);
      });
  }, [year, month]);

  const handlePrev = () => {
    direction.current = -1;
    if (month === 1) { setYear((y) => y - 1); setMonth(12); }
    else setMonth((m) => m - 1);
  };

  const handleNext = () => {
    direction.current = 1;
    if (month === 12) { setYear((y) => y + 1); setMonth(1); }
    else setMonth((m) => m + 1);
  };

  const grid = buildGrid(year, month);
  const rows: (number | null)[][] = [];
  for (let i = 0; i < grid.length; i += 7) {
    rows.push(grid.slice(i, i + 7));
  }

  return (
    <div className="flex flex-col gap-8 items-center w-full">
      {/* 헤더 */}
      <CalendarHeader
        year={year}
        month={month}
        onPrev={handlePrev}
        onNext={handleNext}
      />

      {/* Body */}
      <div className="flex flex-col gap-[18px] w-full overflow-hidden">
        {/* 요일 헤더 */}
        <div className="flex gap-[4px] items-center w-full">
          {WEEKDAYS.map((day) => (
            <div key={day} className="flex flex-1 items-center justify-center">
              <span className="font-sans text-[16px] font-normal leading-[1.4] tracking-[-0.32px] text-[#666666] whitespace-nowrap">
                {day}
              </span>
            </div>
          ))}
        </div>

        {/* 날짜 행 */}
        <AnimatePresence mode="wait" initial={false} custom={direction.current}>
          <motion.div
            key={`${year}-${month}`}
            custom={direction.current}
            variants={{
              enter: (d: number) => ({ x: `${d * 40}px`, opacity: 0 }),
              center: { x: "0px", opacity: 1 },
              exit: (d: number) => ({ x: `${d * -40}px`, opacity: 0 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="flex flex-col gap-[18px] w-full"
          >
            {rows.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-[4px] items-center w-full">
                {row.map((date, colIdx) => {
                  if (date === null) {
                    return (
                      <div
                        key={colIdx}
                        className="flex-1 min-w-0 aspect-[2/3] rounded-[8px]"
                      />
                    );
                  }
                  const record = dayMap[date];
                  return (
                    <div key={colIdx} className="flex-1 min-w-0">
                      <CalendarDay
                        date={date}
                        active={!!record}
                        imageUrl={record?.image_url ?? undefined}
                        count={record?.ids.length}
                        onClick={
                          record
                            ? () => {
                                const firstId = record.ids[0];
                                if (record.ids.length > 1) {
                                  router.push(`/bento/${firstId}?siblings=${record.ids.join(",")}`);
                                } else {
                                  router.push(`/bento/${firstId}`);
                                }
                              }
                            : undefined
                        }
                      />
                    </div>
                  );
                })}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
