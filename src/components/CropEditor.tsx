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

async function getCroppedImg(
  imageSrc: string,
  pixelCrop: Area,
  rotation: number,
  fileName: string
): Promise<File> {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;

  const maxSize = Math.max(image.width, image.height);
  const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

  canvas.width = safeArea;
  canvas.height = safeArea;

  ctx.translate(safeArea / 2, safeArea / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-image.width / 2, -image.height / 2);
  ctx.drawImage(image, 0, 0);

  const data = ctx.getImageData(0, 0, safeArea, safeArea);

  canvas.width = pixelCrop.width;
  canvas.height = pixelCrop.height;

  ctx.putImageData(
    data,
    Math.round(0 - safeArea / 2 + image.width / 2 - pixelCrop.x),
    Math.round(0 - safeArea / 2 + image.height / 2 - pixelCrop.y)
  );

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(new File([blob!], fileName, { type: "image/jpeg" }));
    }, "image/jpeg", 0.95);
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
      className="fixed inset-0 z-50 flex flex-col bg-[#181818]"
    >
      {/* 상단 타이틀 */}
      <div className="flex items-center justify-center px-5 py-4 shrink-0">
        <span className="font-sans text-[16px] font-semibold text-white">이미지 편집</span>
      </div>

      {/* 크롭 영역 */}
      <div className="relative flex-1">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { background: "#181818" },
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
            className="flex items-center gap-1 font-sans text-[14px] font-medium text-white cursor-pointer"
          >
            <span className="text-[18px]">↺</span> 왼쪽 회전
          </button>
          <button
            type="button"
            onClick={() => handleRotate(90)}
            className="flex items-center gap-1 font-sans text-[14px] font-medium text-white cursor-pointer"
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
