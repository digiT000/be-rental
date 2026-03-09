import { CreateVehicleModelRequest } from "../dto/vehicleModel";
import { VehicleModelService } from "../service/vehicle-model.service";
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

  async getVehicleById(req: Request, res: Response) {
    const { id } = req.params;
    const result = await this.VehicleModelService.getVehicleById(id as string);
    return res.status(200).json(result);
  }
}
