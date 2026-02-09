"use client";

import { useEffect } from "react";
import { ensureHubStarted, getHub } from "@/lib/signalr";
import { useAdsStore } from "@/store/useAdsStore";
import type { PendingAd, PublicAd, StatusChangedEvent } from "@/lib/types";

export default function RealtimeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const prependHomeAd = useAdsStore((s) => s.prependHomeAd);
  const prependPendingAd = useAdsStore((s) => s.prependPendingAd);
  const removePendingAd = useAdsStore((s) => s.removePendingAd);
  const updateMyAdStatus = useAdsStore((s) => s.updateMyAdStatus);

  useEffect(() => {
    const hub = getHub();

    const start = async () => {
      await ensureHubStarted();

      hub.on("CarAdApproved", (payload: PublicAd) => {
        prependHomeAd(payload);
      });

      hub.on("CarAdPending", (payload: PendingAd) => {
        prependPendingAd(payload);
      });

      hub.on("CarAdApprovedForAdmins", (payload: { id: number }) => {
        removePendingAd(payload.id);
      });

      hub.on("CarAdRejectedForAdmins", (payload: { id: number }) => {
        removePendingAd(payload.id);
      });

      hub.on("CarAdStatusChanged", (payload: StatusChangedEvent) => {
        updateMyAdStatus(payload);
      });
    };

    start();

    return () => {
      hub.off("CarAdApproved");
      hub.off("CarAdPending");
      hub.off("CarAdApprovedForAdmins");
      hub.off("CarAdRejectedForAdmins");
      hub.off("CarAdStatusChanged");
    };
  }, [prependHomeAd, prependPendingAd, removePendingAd, updateMyAdStatus]);

  return <>{children}</>;
}
