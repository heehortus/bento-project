"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function useLike(bentoId: string, userId: string | null) {
  const [isLiked, setIsLiked] = useState(false);
  const [isPending, setIsPending] = useState(false);

  useEffect(() => {
    if (!userId) return;
    supabase
      .from("bento_likes")
      .select("id")
      .eq("bento_id", bentoId)
      .eq("user_id", userId)
      .maybeSingle()
      .then(({ data }) => {
        setIsLiked(!!data);
      });
  }, [bentoId, userId]);

  const toggle = async () => {
    if (!userId || isPending) return;
    setIsPending(true);
    const nextLiked = !isLiked;
    setIsLiked(nextLiked);

    if (nextLiked) {
      const { error } = await supabase
        .from("bento_likes")
        .insert({ bento_id: bentoId, user_id: userId });
      if (error) setIsLiked(!nextLiked);
    } else {
      const { error } = await supabase
        .from("bento_likes")
        .delete()
        .eq("bento_id", bentoId)
        .eq("user_id", userId);
      if (error) setIsLiked(!nextLiked);
    }
    setIsPending(false);
  };

  return { isLiked, toggle, isPending };
}
