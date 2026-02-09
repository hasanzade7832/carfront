export enum CarAdType {
  UsedSale = 1,
  CoopSale = 2,
  BuyRequest = 3,
  ZeroSale = 4,
}

export enum GearboxType {
  None = 0,
  Automatic = 1,
  Manual = 2,
}

export type CarAdStatus = "Pending" | "Approved" | "Rejected";

export type PublicAd = {
  id: number;
  type: CarAdType;
  title: string;
  year: number;
  color: string;
  mileageKm: number;
  price: number; // میلیون تومان
  gearbox: GearboxType;
  createdAt: string;
};

export type PendingAd = PublicAd & {
  chassisNumber: string;
  userId: number;
};

export type StatusChangedEvent = {
  adId: number;
  status: CarAdStatus;
  approvedAt?: string | null;
  rejectedAt?: string | null;
};
