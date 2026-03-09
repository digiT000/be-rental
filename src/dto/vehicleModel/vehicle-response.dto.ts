export interface VehicleResponse {
  /** Unique identifier for the vehicle model */
  id: string;

  /** Name of the vehicle model */
  name: string;

  /** Unique identifier of the associated brand */
  brandId: string;

  pricePerDay: number;

  year: number;

  imageUrl: string;

  type: string;

  /** Additional features of the vehicle model as a JSON object (optional) */
  features: Record<string, any> | null;
}
