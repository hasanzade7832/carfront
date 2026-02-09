import { create } from "zustand";
import type { PendingAd, PublicAd, StatusChangedEvent } from "@/lib/types";

export type MyAd = PendingAd & { status: string };

type AdsState = {
  homeAds: PublicAd[];
  pendingAds: PendingAd[];
  myAds: MyAd[];

  setHomeAds: (ads: PublicAd[]) => void;
  prependHomeAd: (ad: PublicAd) => void;

  setPendingAds: (ads: PendingAd[]) => void;
  prependPendingAd: (ad: PendingAd) => void;
  removePendingAd: (id: number) => void;

  setMyAds: (ads: MyAd[]) => void;
  updateMyAdStatus: (e: StatusChangedEvent) => void;
};

export const useAdsStore = create<AdsState>((set, get) => ({
  homeAds: [],
  pendingAds: [],
  myAds: [],

  setHomeAds: (ads) => set({ homeAds: ads }),
  prependHomeAd: (ad) => {
    const cur = get().homeAds;
    if (cur.some((x) => x.id === ad.id)) return;
    set({ homeAds: [ad, ...cur] });
  },

  setPendingAds: (ads) => set({ pendingAds: ads }),
  prependPendingAd: (ad) => {
    const cur = get().pendingAds;
    if (cur.some((x) => x.id === ad.id)) return;
    set({ pendingAds: [ad, ...cur] });
  },
  removePendingAd: (id) =>
    set({ pendingAds: get().pendingAds.filter((x) => x.id !== id) }),

  setMyAds: (ads) => set({ myAds: ads }),
  updateMyAdStatus: (e) => {
    set({
      myAds: get().myAds.map((x) =>
        x.id === e.adId ? { ...x, status: e.status } : x
      ),
    });
  },
}));
