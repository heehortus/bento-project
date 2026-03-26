"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import ImageUploader from "@/components/ImageUploader";
import TextInput from "@/components/TextInput";
import SelectInput from "@/components/SelectInput";
import Button from "@/components/Button";
import Feedback from "@/components/Feedback";
import CancelIconSrc from "@/asset/image/Icon/Cancel.svg";

interface DialogFormData {
  image: File | null;
  title: string;
  menu: string;
  companion: string;
  names: string;
}

interface DialogInitialData {
  imageUrl?: string;
  title?: string;
  menu?: string;
  companion?: string;
  names?: string;
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit?: (data: DialogFormData) => Promise<void>;
  mode?: "create" | "edit";
  initialData?: DialogInitialData;
}

export default function Dialog({
  isOpen,
  onClose,
  onSubmit,
  mode = "create",
  initialData,
}: DialogProps) {
  const [image, setImage] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [menu, setMenu] = useState("");
  const [companion, setCompanion] = useState("혼자");
  const [names, setNames] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [titleError, setTitleError] = useState(false);
  const [namesError, setNamesError] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title ?? "");
      setMenu(initialData?.menu ?? "");
      setCompanion(initialData?.companion ?? "혼자");
      setNames(initialData?.names ?? "");
      setImage(null);
      setTitleError(false);
      setNamesError(false);
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    if (mode === "create" && !image) {
      setFeedbackMessage("사진을 업로드해주세요.");
      return;
    }

    if (!title.trim()) {
      setTitleError(true);
      return;
    }

    if (companion === "함께" && !names.trim()) {
      setNamesError(true);
      return;
    }

    if (!onSubmit) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ image, title, menu, companion, names });
    } catch {
      setFeedbackMessage("저장 중 오류가 발생했어요. 잠시 후 다시 시도해 주세요.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          >
            <motion.div
              className="relative bg-white rounded-[8px] w-[492px] max-h-[90vh] overflow-y-auto px-6 py-8"
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 닫기 버튼 */}
              <button
                type="button"
                className="cursor-pointer absolute top-[18px] right-[10px] w-10 h-10 flex items-center justify-center"
                aria-label="닫기"
                onClick={onClose}
              >
                <Image src={CancelIconSrc} alt="" width={24} height={24} unoptimized />
              </button>

              <div className="flex flex-col gap-8 items-start w-full">
                {/* Body */}
                <div className="flex flex-col gap-6 items-start w-full">
                  {/* 사진 영역 */}
                  {mode === "create" ? (
                    <ImageUploader
                      label="오늘의 도시락"
                      onChange={(file) => setImage(file)}
                      onError={(message) => setFeedbackMessage(message)}
                    />
                  ) : (
                    <div className="flex flex-col gap-4 items-start w-full">
                      <p className="font-sans text-[20px] font-bold leading-[20px] tracking-[0.08px] text-foreground w-full">
                        오늘의 도시락
                      </p>
                      <div className="aspect-[4/3] w-full rounded-[8px] overflow-hidden border border-normal">
                        {initialData?.imageUrl ? (
                          <img
                            src={initialData.imageUrl}
                            alt="도시락 사진"
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-[#e0e0e0]" />
                        )}
                      </div>
                    </div>
                  )}

                  {/* 제목 */}
                  <TextInput
                    label="제목"
                    placeholder="도시락에 대해 한 줄 소개해주세요."
                    required
                    maxLength={50}
                    showCounter
                    showHelperText={false}
                    state={titleError ? "error" : "normal"}
                    errorText="제목을 입력해 주세요."
                    value={title}
                    onChange={(e) => {
                      setTitle(e.target.value);
                      if (titleError) setTitleError(false);
                    }}
                  />

                  {/* 오늘의 도시락 메뉴 */}
                  <TextInput
                    label="오늘의 도시락 메뉴"
                    placeholder="오늘의 도시락 메뉴를 적어주세요."
                    required={false}
                    maxLength={100}
                    showCounter
                    showHelperText
                    helperText="메뉴 사이에 띄어쓰기를 입력해주세요. 예시) 김밥 볶음밥 계란말이"
                    value={menu}
                    onChange={(e) => setMenu(e.target.value)}
                  />

                  {/* 함께 먹은 사람 */}
                  <SelectInput
                    label="도시락을 함께 먹은 사람이 있나요?"
                    options={["혼자", "함께"]}
                    value={companion}
                    onChange={setCompanion}
                  />

                  {/* 함께 먹은 사람 이름 — '함께' 선택 시에만 표시 */}
                  <AnimatePresence>
                    {companion === "함께" && (
                      <motion.div
                        className="w-full overflow-hidden"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                      >
                        <TextInput
                          placeholder="함께 먹은 사람들을 알려주세요!"
                          showHeading={false}
                          showHelperText={!namesError}
                          helperText="예시) 친구들 | 가족들 | 가가, 나나"
                          state={namesError ? "error" : "normal"}
                          errorText="함께 먹은 사람을 입력해 주세요."
                          value={names}
                          onChange={(e) => {
                            setNames(e.target.value);
                            if (namesError) setNamesError(false);
                          }}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* 제출 버튼 */}
                <Button
                  variant="solid"
                  size="large"
                  label={
                    isSubmitting
                      ? "저장 중..."
                      : mode === "edit"
                        ? "수정 완료"
                        : "도시락 기록 완료"
                  }
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Feedback
        isOpen={feedbackMessage !== null}
        message={feedbackMessage ?? ""}
        onClose={() => setFeedbackMessage(null)}
      />
    </>
  );
}
