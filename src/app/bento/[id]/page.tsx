"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import TopNavigation from "@/components/TopNavigation";
import Button from "@/components/Button";
import Dialog from "@/components/Dialog";
import Feedback from "@/components/Feedback";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";

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
  const id = params.id as string;

  const { user } = useAuth();
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
    const menuItems = data.menu.trim()
      ? data.menu.trim().split(/\s+/)
      : null;

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
      setFeedbackMessage("삭제 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } else {
      router.push("/");
    }
  };

  if (loading || !item) return null;

  const isOwner = user !== null && item.user_id === user.id;

  return (
    <>
      <div className="flex flex-col min-h-screen">
        <TopNavigation />
        <div className="flex flex-col items-center flex-1">
          <div className="flex flex-col gap-6 pt-10 pb-20 px-8 w-full max-w-[800px]">

            {/* 뒤로 */}
            <Link
              href="/"
              className="font-sans text-[16px] font-normal leading-[1.2] tracking-[-0.64px] text-foreground"
            >
              ← 뒤로
            </Link>

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

          </div>
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
