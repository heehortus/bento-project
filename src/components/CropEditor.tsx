"use client";

import { useCallback, useState } from "react";
import Cropper from "react-easy-crop";
import type { Area } from "react-easy-crop";
import { motion } from "framer-motion";
import Button from "@/components/Button";

interface CropEditorProps {
  imageSrc: string;
  fileName: string;
  onComplete: (file: File) => void;
  onCancel: () => void;
}

async function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", reject);
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

function rotateSize(width: number, height: number, rotation: number) {
  const rad = toRad(rotation);
  return {
    width: Math.abs(Math.cos(rad) * width) + Math.abs(Math.sin(rad) * height),
    height: Math.abs(Math.sin(rad) * width) + Math.abs(Math.cos(rad) * height),
  };
}

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  fileName: string
): Promise<File> {
  const image = await createImage(imageSrc);

  // 1단계: 회전된 이미지의 실제 경계 박스 크기로 캔버스 생성
  const { width: bw, height: bh } = rotateSize(image.width, image.height, rotation);
  const rotCanvas = document.createElement("canvas");
  rotCanvas.width = bw;
  rotCanvas.height = bh;
  const rotCtx = rotCanvas.getContext("2d")!;

  rotCtx.translate(bw / 2, bh / 2);
  rotCtx.rotate(toRad(rotation));
  rotCtx.translate(-image.width / 2, -image.height / 2);
  rotCtx.drawImage(image, 0, 0);

  // 2단계: croppedAreaPixels 영역만 잘라내어 최종 캔버스에 복사
  const cropCanvas = document.createElement("canvas");
  cropCanvas.width = pixelCrop.width;
  cropCanvas.height = pixelCrop.height;
  const cropCtx = cropCanvas.getContext("2d")!;

  cropCtx.drawImage(
    rotCanvas,
    pixelCrop.x, pixelCrop.y, pixelCrop.width, pixelCrop.height,
    0, 0, pixelCrop.width, pixelCrop.height
  );

  return new Promise((resolve) => {
    cropCanvas.toBlob(
      (blob) => resolve(new File([blob!], fileName, { type: "image/jpeg" })),
      "image/jpeg",
      0.95
    );
  });
}

export default function CropEditor({
  imageSrc,
  fileName,
  onComplete,
  onCancel,
}: CropEditorProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const onCropComplete = useCallback((_: Area, pixels: Area) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleApply = async () => {
    if (!croppedAreaPixels) return;
    const file = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, fileName);
    onComplete(file);
  };

  const handleRotate = (deg: number) => {
    setRotation((r) => (r + deg + 360) % 360);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.18 }}
      className="fixed inset-0 z-50 flex flex-col bg-background"
    >
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-center px-5 py-4 shrink-0">
        <span className="font-sans text-[16px] font-semibold text-foreground">이미지 편집</span>
      </div>

      {/* 크롭 영역 */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={4 / 3}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: "var(--background)" },
            cropAreaStyle: { borderColor: "#7fffd4" },
          }}
        />
      </div>

      {/* 하단 컨트롤 */}
      <div className="flex flex-col gap-4 px-5 py-6 shrink-0">
        {/* 회전 버튼 */}
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => handleRotate(-90)}
            className="flex items-center gap-1 font-sans text-[14px] font-medium text-foreground cursor-pointer"
          >
            <span className="text-[18px]">↺</span> 왼쪽 회전
          </button>
          <button
            type="button"
            onClick={() => handleRotate(90)}
            className="flex items-center gap-1 font-sans text-[14px] font-medium text-foreground cursor-pointer"
          >
            오른쪽 회전 <span className="text-[18px]">↻</span>
          </button>
        </div>

        {/* 취소 / 적용 */}
        <div className="flex gap-4">
          <Button variant="outlined" size="large" label="취소" onClick={onCancel} className="flex-1" />
          <Button variant="solid" size="large" label="적용" onClick={handleApply} className="flex-1" />
        </div>
      </div>
    </motion.div>
  );
}
