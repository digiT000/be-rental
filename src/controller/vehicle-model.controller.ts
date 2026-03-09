import {
  CreateVehicleModelRequest,
  UpdateVehicleModelRequest,
} from "../dto/vehicleModel/index.js";
import { VehicleModelService } from "../service/vehicle-model.service.js";
import type { Request, Response } from "express";

export class VehicleModelController {
  VehicleModelService: VehicleModelService;

  constructor() {
    this.VehicleModelService = new VehicleModelService();
  }

  async createVehicle(req: Request, res: Response) {
    const vehicleData = req.body as CreateVehicleModelRequest;
    const result = await this.VehicleModelService.createVehicle(vehicleData);
    return res.status(201).json(result);
  }

  async updateVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const vehicleData = req.body as UpdateVehicleModelRequest;

    console.log("DATA", { vehicleData });

    if (!vehicleData) {
      return res.status(400).json({ message: "Empty request body" });
    }

    const result = await this.VehicleModelService.updateVehicle(
      id as string,
      vehicleData
    );
    return res.status(200).json(result);
  }

  async getVehicleById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.VehicleModelService.getVehicleById(id as string);
    return res.status(200).json(result);
  }

  async deleteVehicle(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.VehicleModelService.deleteVehicle(id as string);
    return res.status(200).json(result);
  }
}
