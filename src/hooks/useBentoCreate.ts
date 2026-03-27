"use client";

import { supabase } from "@/lib/supabase";

interface DialogFormData {
  image: File | null;
  title: string;
  menu: string;
  companion: string;
  names: string;
}

interface BentoCreatedData {
  inserted: {
    id: string;
    title: string;
    menu: string[] | null;
    companion: boolean;
    companion_person: string | null;
    image_url: string | null;
    created_at: string;
    user_id: string | null;
  };
  imageUrl: string;
}

type BentoCreatedCallback = (data: BentoCreatedData) => void;

export function useBentoCreate(onSuccess?: BentoCreatedCallback) {
  return async (formData: DialogFormData): Promise<void> => {
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
    if (formData.image) {
      const ext = formData.image.name.split(".").pop();
      const path = `${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("bento-images")
        .upload(path, formData.image);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("bento-images")
        .getPublicUrl(path);
      imageUrl = urlData.publicUrl;
    }

    const isCompanion = formData.companion === "함께";
    const menuItems = formData.menu.trim()
      ? formData.menu.trim().split(/\s+/)
      : null;

    const { data: inserted, error: insertError } = await supabase
      .from("bento")
      .insert({
        title: formData.title,
        menu: menuItems,
        companion: isCompanion,
        companion_person: isCompanion ? formData.names || null : null,
        image_url: imageUrl || null,
        user_id: userId,
      })
      .select()
      .single();

    if (insertError) throw insertError;

    onSuccess?.({ inserted, imageUrl });
  };
}
