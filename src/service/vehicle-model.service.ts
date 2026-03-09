import { env } from "../config/env.js";
import {
  CreateVehicleModelRequest,
  VehicleResponse,
  toVehicleModelResponse,
  UpdateVehicleModelRequest,
  VehicleDetailResponse,
  toVehicleDetailResponse,
} from "../dto/vehicleModel/index.js";
import { VehicleModels } from "../models/vehicle-model.js";

export class VehicleModelService {
  vehicleModel: VehicleModels;

  constructor() {
    this.vehicleModel = new VehicleModels();
  }

  async createVehicle(
    vehicle: CreateVehicleModelRequest
  ): Promise<VehicleResponse> {
    const imageUrl = vehicle?.imageUrl
      ? `${env.BASE_CDN_URL_IMAGE}/${vehicle.imageUrl}`
      : "null";

    const result = await this.vehicleModel.create({ ...vehicle, imageUrl });
    return toVehicleModelResponse(result);
  }

  async updateVehicle(id: string, vehicle: UpdateVehicleModelRequest) {
    if (vehicle?.imageUrl) {
      vehicle.imageUrl = `${env.BASE_CDN_URL_IMAGE}/${vehicle.imageUrl}`;
    }

    const result = await this.vehicleModel.update(id, vehicle);
    return toVehicleModelResponse(result);
  }

  async getVehicleById(id: string): Promise<VehicleDetailResponse> {
    const result = await this.vehicleModel.findById(id);
    return toVehicleDetailResponse(result);
  }

  async deleteVehicle(id: string) {
    await this.vehicleModel.delete(id);

    return {
      id: id,
      message: "Vehicle model deleted successfully",
    };
  }
}
