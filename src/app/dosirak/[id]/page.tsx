"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import TopNavigation from "@/components/TopNavigation";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Feedback from "@/components/Feedback";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { useBentoCreate } from "@/hooks/useBentoCreate";
import { useLike } from "@/hooks/useLike";

interface BentoDetail {
  id: string;
  title: string;
  menu: string[] | null;
  companion: boolean;
  companion_person: string | null;
  image_url: string | null;
  created_at: string;
  user_id: string | null;
}

interface DialogFormData {
  image: File | null;
  title: string;
  menu: string;
  companion: string;
  names: string;
}

export default function BentoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;

  const siblings =
    searchParams.get("siblings")?.split(",").filter(Boolean) ?? [];
  const siblingIndex = siblings.indexOf(id);
  const hasSiblings = siblings.length > 1;
  const prevId = siblingIndex > 0 ? siblings[siblingIndex - 1] : null;
  const nextId =
    siblingIndex < siblings.length - 1 ? siblings[siblingIndex + 1] : null;
  const fromCalendar = searchParams.get("from") === "calendar";
  const backHref = fromCalendar ? "/calendar" : "/";
  const siblingsParam = hasSiblings
    ? `?siblings=${siblings.join(",")}&from=calendar`
    : fromCalendar
    ? "?from=calendar"
    : "";

  const { user } = useAuth();
  const handleBentoSubmit = useBentoCreate();
  const {
    isLiked,
    toggle: toggleLike,
    isPending: isLikePending,
  } = useLike(id, user?.id ?? null);
  const [item, setItem] = useState<BentoDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("bento")
      .select("*")
      .eq("id", id)
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          router.replace("/");
        } else {
          setItem(data);
        }
        setLoading(false);
      });
  }, [id, router]);

  const handleEdit = async (data: DialogFormData) => {
    const isCompanion = data.companion === "함께";
    const menuItems = data.menu.trim() ? data.menu.trim().split(/\s+/) : null;

    const { data: updated, error } = await supabase
      .from("bento")
      .update({
        title: data.title,
        menu: menuItems,
        companion: isCompanion,
        companion_person: isCompanion ? data.names || null : null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;

    setItem((prev) =>
      prev
        ? {
            ...prev,
            title: updated.title,
            menu: updated.menu ?? null,
            companion: updated.companion,
            companion_person: updated.companion_person ?? null,
          }
        : prev
    );
    setIsEditOpen(false);
  };

  const handleDelete = async () => {
    const { error } = await supabase.from("bento").delete().eq("id", id);
    setIsDeleteConfirmOpen(false);
    if (error) {
      setFeedbackMessage(
        "삭제 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요."
      );
    } else {
      const remaining = siblings.filter((s) => s !== id);
      if (remaining.length > 0) {
        const target = nextId ?? prevId ?? remaining[0];
        router.push(
          `/dosirak/${target}?siblings=${remaining.join(",")}&from=calendar`
        );
      } else {
        router.push(backHref);
      }
    }
  };

  if (loading || !item) return null;

  const isOwner = user !== null && item.user_id === user.id;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TopNavigation onBentoSubmit={handleBentoSubmit} />
        <div className="flex flex-col items-center flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 12 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-6 pt-10 pb-20 px-6 w-full max-w-[800px]"
            >
              {/* 뒤로 / 이전·다음 컨트롤러 */}
              <div className="flex items-center justify-between w-full">
                <Link
                  href={backHref}
                  className="flex items-center h-10 font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-foreground"
                >
                  ← 뒤로
                </Link>

                {hasSiblings && (
                  <div className="flex items-center gap-[24px]">
                    {prevId ? (
                      <Link
                        href={`/dosirak/${prevId}${siblingsParam}`}
                        className="flex items-center h-10 font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-foreground"
                      >
                        ← 이전
                      </Link>
                    ) : (
                      <span className="flex items-center h-10 font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-[#cccccc]">
                        ← 이전
                      </span>
                    )}
                    {nextId ? (
                      <Link
                        href={`/dosirak/${nextId}${siblingsParam}`}
                        className="flex items-center h-10 font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-foreground"
                      >
                        다음 →
                      </Link>
                    ) : (
                      <span className="flex items-center h-10 font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-[#cccccc]">
                        다음 →
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* 사진 */}
              {item.image_url && (
                <div className="w-full border border-normal rounded-[8px] overflow-hidden aspect-[4/3]">
                  <img
                    src={item.image_url}
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* 제목 */}
              <h1 className="font-sans text-[28px] md:text-[32px] font-semibold leading-[1.2] tracking-[-1.12px] md:tracking-[-1.28px] text-foreground">
                {item.title}
              </h1>

              {/* 메뉴 */}
              {item.menu && item.menu.length > 0 && (
                <div className="flex flex-col">
                  {item.menu.map((m, i) => (
                    <span
                      key={i}
                      className="font-sans text-[16px] font-normal leading-[1.5] tracking-[-0.32px] text-foreground"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}

              {/* 함께한 사람 */}
              {item.companion && item.companion_person && (
                <span className="font-sans text-[16px] font-normal leading-[1.5] tracking-[-0.32px] text-[#666666]">
                  @{item.companion_person}
                </span>
              )}

              {/* 좋아요 */}
              <div className="self-stretch inline-flex justify-end items-center">
                <button
                  type="button"
                  onClick={toggleLike}
                  disabled={isLikePending}
                  aria-label={isLiked ? "좋아요 취소" : "좋아요"}
                  className="flex items-center justify-center w-10 h-10 -ml-1 transition-transform active:scale-90 disabled:opacity-50 cursor-pointer"
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill={isLiked ? "#7fffd4" : "none"}
                    stroke={isLiked ? "#7fffd4" : "#999999"}
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </button>
              </div>

              {/* 버튼 — 본인 글에만 표시 */}
              {isOwner && (
                <div className="flex gap-4 w-full">
                  <Button
                    variant="outlined"
                    size="large"
                    label="수정"
                    onClick={() => setIsEditOpen(true)}
                    className="flex-1"
                  />
                  <Button
                    variant="solid"
                    size="large"
                    label="삭제"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="flex-1"
                  />
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* 수정 Dialog */}
      <Dialog
        isOpen={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleEdit}
        mode="edit"
        initialData={{
          imageUrl: item.image_url ?? undefined,
          title: item.title,
          menu: item.menu?.join(" ") ?? "",
          companion: item.companion ? "함께" : "혼자",
          names: item.companion_person ?? "",
        }}
      />

      {/* 삭제 확인 */}
      <Feedback
        isOpen={isDeleteConfirmOpen}
        title="삭제한 기록은 복구되지 않습니다."
        message="삭제한 도시락은 다시 볼 수 없어요. 정말 삭제하시겠어요?"
        onClose={() => setIsDeleteConfirmOpen(false)}
        variant="double"
        secondaryLabel="취소"
        primaryLabel="확인"
        onSecondary={() => setIsDeleteConfirmOpen(false)}
        onPrimary={handleDelete}
      />

      {/* 에러 알림 */}
      <Feedback
        isOpen={feedbackMessage !== null}
        message={feedbackMessage ?? ""}
        onClose={() => setFeedbackMessage(null)}
      />
    </>
  );
}
