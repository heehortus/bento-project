"use client";

import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/Button";

interface FeedbackProps {
  isOpen: boolean;
  title?: string;
  message: string;
  onClose: () => void;
  variant?: "single" | "double";
  primaryLabel?: string;
  secondaryLabel?: string;
  onPrimary?: () => void;
  onSecondary?: () => void;
}

export default function Feedback({
  isOpen,
  title = "오류가 발생했어요.",
  message,
  onClose,
  variant = "single",
  primaryLabel = "확인",
  secondaryLabel = "취소",
  onPrimary,
  onSecondary,
}: FeedbackProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-[8px] w-[492px] mx-5 px-6 py-8"
            initial={{ opacity: 0, scale: 0.95, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-8 items-start w-full">
              <p className="font-sans text-[20px] font-bold leading-[20px] tracking-[0.08px] text-foreground w-full">
                {title}
              </p>
              <p className="font-sans text-[16px] font-medium leading-[20px] tracking-[-0.32px] text-normal w-full">
                {message}
              </p>
              {variant === "single" ? (
                <Button
                  cursor="pointer"
                  variant="solid"
                  size="large"
                  label={primaryLabel}
                  onClick={onPrimary ?? onClose}
                  className="w-full"
                />
              ) : (
                <div className="flex gap-4 w-full">
                  <Button
                    cursor="pointer"
                    variant="outlined"
                    size="large"
                    label={secondaryLabel}
                    onClick={onSecondary ?? onClose}
                    className="flex-1"
                  />
                  <Button
                    cursor="pointer"
                    variant="solid"
                    size="large"
                    label={primaryLabel}
                    onClick={onPrimary ?? onClose}
                    className="flex-1"
                  />
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
