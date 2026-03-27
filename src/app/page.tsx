"use client";

import { useEffect, useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import Gallery from "@/components/Gallery";
import { supabase } from "@/lib/supabase";
import { BentoItem } from "@/types/bento";
import { useBentoCreate } from "@/hooks/useBentoCreate";

export default function Home() {
  const [items, setItems] = useState<BentoItem[]>([]);

  useEffect(() => {
    supabase
      .from("bento")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (!data) return;
        setItems(
          data.map((row) => {
            const now = new Date(row.created_at);
            const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
            return {
              id: String(row.id),
              imageUrl: row.image_url ?? "",
              title: row.title,
              menu: Array.isArray(row.menu) ? row.menu : [],
              companion: row.companion ? "함께" : "혼자",
              names: row.companion_person ?? "",
              date,
            };
          })
        );
      });
  }, []);

  const handleBentoSubmit = useBentoCreate(({ inserted, imageUrl }) => {
    const now = new Date(inserted.created_at ?? Date.now());
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;
    const newItem: BentoItem = {
      id: String(inserted.id),
      imageUrl,
      title: inserted.title,
      menu: Array.isArray(inserted.menu) ? inserted.menu : [],
      companion: inserted.companion ? "함께" : "혼자",
      names: inserted.companion_person ?? "",
      date,
    };
    setItems((prev) => [newItem, ...prev]);
  });

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation onBentoSubmit={handleBentoSubmit} />
      <Gallery items={items} />
    </div>
  );
}
