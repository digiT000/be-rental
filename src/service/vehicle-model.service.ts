import { env } from "../config/env.js";
import {
  CreateVehicleModelRequest,
  VehicleResponse,
  toVehicleModelResponse,
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

  async getVehicleById(id: string) {
    const result = await this.vehicleModel.findById(id);
    console.log({ result });
    return result;
  }
}
