"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import UploadIconSrc from "@/asset/image/Icon/Upload.svg";

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

  const handleClick = () => {
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

    setPreview(URL.createObjectURL(file));
    onChange?.(file);
  };

  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <p className="font-sans text-[20px] font-bold leading-[20px] tracking-[0.08px] text-foreground w-full">
        {label}
      </p>

      <button
        type="button"
        onClick={handleClick}
        className="aspect-[4/3] w-full bg-white border border-normal rounded-[8px] flex flex-col items-center justify-center overflow-hidden cursor-pointer"
      >
        {preview ? (
          <img
            src={preview}
            alt="업로드된 사진"
            className="w-full h-full object-cover"
          />
        ) : (
          <>
            <Image
              src={UploadIconSrc}
              alt=""
              width={40}
              height={40}
              unoptimized
            />
            <span className="font-sans text-[14px] font-normal leading-[20px] tracking-[-0.28px] text-normal">
              사진 업로드<br/>5MB 이하의 JPG, PNG, WEBP, HEIC 파일을 업로드할 수 있어요.
            </span>
          </>
        )}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
