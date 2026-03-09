import { BrandResponse } from "../brand/index.js";

export interface VehicleDetailResponse {
  /** Unique identifier for the vehicle model */
  id: string;

  /** Name of the vehicle model */
  name: string;

  brand: BrandResponse;

  pricePerDay: number;

  year: number;

  imageUrl: string;

  type: string;

  /** Additional features of the vehicle model as a JSON object (optional) */
  features: Record<string, any> | null;
}
