import BentoCard from "@/components/BentoCard";
import { BentoItem } from "@/types/bento";

interface GalleryProps {
  items: BentoItem[];
}

export default function Gallery({ items }: GalleryProps) {
  if (items.length === 0) return null;

  return (
    <main className="w-full px-5 py-10 md:px-[120px] md:py-[80px]">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {items.map((item) => (
          <BentoCard key={item.id} item={item} />
        ))}
      </div>
    </main>
  );
}
