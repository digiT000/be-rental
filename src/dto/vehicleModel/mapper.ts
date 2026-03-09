import type { VehicleModelWithBrand } from "../../models/vehicle-model.js";
import { VehicleModel } from "../../types/database.types";
import { VehicleResponse } from "./vehicle-response.dto";
import { VehicleDetailResponse } from "./vehicle-detaill-response.dto";

export const toVehicleModelResponse = (
  vehicleModel: Omit<
    VehicleModel,
    "created_at" | "updated_at" | "is_deleted" | "deleted_at"
  >
): VehicleResponse => {
  return {
    id: vehicleModel.id,
    name: vehicleModel.name,
    brandId: vehicleModel.brand_id,
    pricePerDay: vehicleModel.price_per_day,
    year: vehicleModel.year,
    imageUrl: vehicleModel.image_url,
    type: vehicleModel.type,
    features: vehicleModel.features ?? null,
  };
};

export const toVehicleDetailResponse = (
  vehicle: VehicleModelWithBrand
): VehicleDetailResponse => ({
  id: vehicle.id,
  name: vehicle.name,
  brand: {
    id: vehicle.brand_id,
    name: vehicle.brand_name,
    logoUrl: vehicle.brand_logo_url,
  },
  pricePerDay: vehicle.price_per_day,
  year: vehicle.year,
  imageUrl: vehicle.image_url,
  type: vehicle.type,
  features: vehicle.features ?? null,
});
