import { VehicleModel } from "../../types/database.types";
import { VehicleResponse } from "./vehicle-response.dto";

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
