"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import UploadIconSrc from "@/asset/image/Icon/Upload.svg";
import CropEditor from "@/components/CropEditor";

const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"];

interface ImageUploaderProps {
  label?: string;
  onChange?: (file: File) => void;
  onError?: (message: string) => void;
}

export default function ImageUploader({
  label = "오늘의 도시락",
  onChange,
  onError,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [originalSrc, setOriginalSrc] = useState<string | null>(null);
  const [originalFileName, setOriginalFileName] = useState<string>("image.jpg");
  const [isCropOpen, setIsCropOpen] = useState(false);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      onError?.("사진 용량을 초과했어요.");
      e.target.value = "";
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      onError?.("JPG, PNG, WEBP, HEIC 파일만 업로드 가능해요.");
      e.target.value = "";
      return;
    }

    const src = URL.createObjectURL(file);
    setOriginalSrc(src);
    setOriginalFileName(file.name);
    setIsCropOpen(true);
    e.target.value = "";
  };

  const handleCropComplete = (croppedFile: File) => {
    const croppedUrl = URL.createObjectURL(croppedFile);
    setPreview(croppedUrl);
    onChange?.(croppedFile);
    setIsCropOpen(false);
  };

  const handleCropCancel = () => {
    setIsCropOpen(false);
  };

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (originalSrc) setIsCropOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-4 items-start w-full">
        <p className="font-sans text-[20px] font-bold leading-[20px] tracking-[0.08px] text-foreground w-full">
          {label}
        </p>

        <div className="aspect-[4/3] w-full bg-white border border-normal rounded-[8px] overflow-hidden relative">
          {preview ? (
            <>
              <img
                src={preview}
                alt="업로드된 사진"
                className="w-full h-full object-cover cursor-pointer"
                onClick={openFilePicker}
              />
              {/* 편집 버튼 */}
              <button
                type="button"
                onClick={handleEditClick}
                className="absolute bottom-2 right-2 bg-[rgba(24,24,24,0.6)] text-white font-sans text-[12px] font-medium px-3 py-1.5 rounded-full cursor-pointer"
              >
                편집
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={openFilePicker}
              className="w-full h-full flex flex-col items-center justify-center gap-2 cursor-pointer"
            >
              <Image
                src={UploadIconSrc}
                alt=""
                width={40}
                height={40}
                unoptimized
              />
              <span className="font-sans text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-normal">
                사진 업로드<br />5MB 이하의 JPG, PNG, WEBP, HEIC 파일을 업로드할 수 있어요.
              </span>
            </button>
          )}
        </div>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      <AnimatePresence>
        {isCropOpen && originalSrc && (
          <CropEditor
            imageSrc={originalSrc}
            fileName={originalFileName}
            onComplete={handleCropComplete}
            onCancel={handleCropCancel}
          />
        )}
      </AnimatePresence>
    </>
  );
}
