import type { PublicAd } from "@/lib/types";
import AdCard from "./AdCard";

export default function AdsGrid({ ads }: { ads: PublicAd[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {ads.map((ad) => (
        <AdCard key={ad.id} ad={ad} />
      ))}
    </div>
  );
}
