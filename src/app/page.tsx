"use client";

import { useEffect, useState } from "react";
import TopNavigation from "@/components/TopNavigation";
import Gallery from "@/components/Gallery";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { BentoItem } from "@/types/bento";

interface DialogFormData {
  image: File | null;
  title: string;
  menu: string;
  companion: string;
  names: string;
}

export default function Home() {
  const { user } = useAuth();
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

  const handleBentoSubmit = async (data: DialogFormData) => {
    // 0. 세션 확인 — 없으면 익명 로그인 후 user_id 확보
    let userId: string | null = null;
    const { data: sessionData } = await supabase.auth.getSession();
    if (sessionData.session?.user) {
      userId = sessionData.session.user.id;
    } else {
      const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();
      if (anonError) throw anonError;
      userId = anonData.user?.id ?? null;
    }

    let imageUrl = "";

    // 1. 이미지 Storage 업로드
    if (data.image) {
      const ext = data.image.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("bento-images")
        .upload(path, data.image);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("bento-images")
        .getPublicUrl(path);

      imageUrl = urlData.publicUrl;
    }

    // 2. bento 테이블 insert
    const isCompanion = data.companion === "함께";
    const menuItems = data.menu.trim()
      ? data.menu.trim().split(/\s+/)
      : null;

    const { data: inserted, error: insertError } = await supabase
      .from("bento")
      .insert({
        title: data.title,
        menu: menuItems,
        companion: isCompanion,
        companion_person: isCompanion ? data.names || null : null,
        image_url: imageUrl || null,
        user_id: userId,
      })
      .select()
      .single();

    if (insertError) throw insertError;
    if (inserted.user_id !== userId) throw new Error("user_id 불일치: insert 결과와 현재 세션이 다릅니다.");

    // 3. 갤러리 상태 업데이트
    const now = new Date(inserted.created_at ?? Date.now());
    const date = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, "0")}.${String(now.getDate()).padStart(2, "0")}`;

    const newItem: BentoItem = {
      id: String(inserted.id),
      imageUrl,
      title: inserted.title,
      menu: Array.isArray(inserted.menu) ? inserted.menu : [],
      companion: isCompanion ? "함께" : "혼자",
      names: inserted.companion_person ?? "",
      date,
    };

    setItems((prev) => [newItem, ...prev]);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <TopNavigation onBentoSubmit={handleBentoSubmit} />
      <Gallery items={items} />
    </div>
  );
}
