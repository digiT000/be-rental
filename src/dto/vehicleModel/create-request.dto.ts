import { VehicleType } from "../../types/database.types";

export interface CreateVehicleModelRequest {
  /** Name of the vehicle model */
  name: string;

  /** ID of the brand this model belongs to */
  brandId: string;

  /** Rental price per day for this vehicle model */
  pricePerDay: number;

  /** Manufacturing year of the vehicle model */
  year: number;

  /** URL of the vehicle model's image */
  imageUrl: string;

  /** Type of the vehicle model (e.g., "car", "motorcycle") */
  type: VehicleType;

  /** Additional features of the vehicle model as a JSON object (optional) */
  features: Record<string, any> | null;
}
