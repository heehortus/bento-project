import Image from "next/image";
import LogoIconSrc from "@/asset/image/Logo.svg";

interface LogoProps {
  variant?: "LogoWithLabel" | "LogoOnlyIcon";
}

export default function Logo({ variant = "LogoOnlyIcon" }: LogoProps) {
  const icon = (
    <Image
      src={LogoIconSrc}
      alt="bento 로고 아이콘"
      width={36}
      height={20}
      unoptimized
    />
  );

  if (variant === "LogoOnlyIcon") return icon;

  return (
    <div className="flex items-center gap-2">
      {icon}
      <span className="font-serif text-[20px] leading-6 text-foreground whitespace-nowrap">
        bento
      </span>
    </div>
  );
}
