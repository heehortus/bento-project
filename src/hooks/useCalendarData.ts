"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface BentoRecord {
  ids: string[];
  image_url: string | null;
}

export type DayMap = Record<number, BentoRecord>;
export type CalendarMode = "mine" | "liked";

export function useCalendarData(
  year: number,
  month: number,
  userId: string | null,
  mode: CalendarMode = "mine"
) {
  const [dayMap, setDayMap] = useState<DayMap>({});

  useEffect(() => {
    if (!userId) return;

    const from = new Date(year, month - 1, 1).toISOString();
    const to = new Date(year, month, 1).toISOString();

    setDayMap({});

    if (mode === "mine") {
      supabase
        .from("bento")
        .select("id, image_url, created_at")
        .eq("user_id", userId)
        .gte("created_at", from)
        .lt("created_at", to)
        .then(({ data }) => {
          if (!data) return;
          setDayMap(buildDayMap(data));
        });
    } else {
      supabase
        .from("bento_likes")
        .select("bento_id")
        .eq("user_id", userId)
        .then(async ({ data: likeRows }) => {
          if (!likeRows || likeRows.length === 0) return;
          const likedIds = likeRows.map((r) => r.bento_id);
          const { data } = await supabase
            .from("bento")
            .select("id, image_url, created_at")
            .in("id", likedIds)
            .gte("created_at", from)
            .lt("created_at", to);
          if (!data) return;
          setDayMap(buildDayMap(data));
        });
    }
  }, [year, month, userId, mode]);

  function addEntry(id: string, imageUrl: string | null, createdAt: string) {
    if (mode !== "mine") return;
    const entryDate = new Date(createdAt);
    if (entryDate.getFullYear() !== year || entryDate.getMonth() + 1 !== month) return;
    const day = entryDate.getDate();
    setDayMap((prev) => {
      const existing = prev[day];
      if (existing) {
        return { ...prev, [day]: { ids: [...existing.ids, id], image_url: existing.image_url } };
      }
      return { ...prev, [day]: { ids: [id], image_url: imageUrl } };
    });
  }

  return { dayMap, addEntry };
}

function buildDayMap(
  data: { id: string | number; image_url: string | null; created_at: string }[]
): DayMap {
  const map: DayMap = {};
  data.forEach((row) => {
    const day = new Date(row.created_at).getDate();
    if (!map[day]) {
      map[day] = { ids: [String(row.id)], image_url: row.image_url };
    } else {
      map[day].ids.push(String(row.id));
    }
  });
  return map;
}
