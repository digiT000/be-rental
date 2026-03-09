import express, { Router } from "express";
import { VehicleModelController } from "../controller/vehicle-model.controller";
import { authorizationMiddlware } from "../middleware/auth.middleware";
import {
  vehicleModelRequest,
  createVehicleModelValidator,
  vehicleModelParamsExistValidator,
} from "../middleware/validation/vehicle-model.validator";

const router: Router = express.Router();
const vehicleModelControllerInstance = new VehicleModelController();

router.post(
  "/",
  authorizationMiddlware("admin"),
  createVehicleModelValidator,
  vehicleModelRequest,
  vehicleModelControllerInstance.createVehicle.bind(
    vehicleModelControllerInstance
  )
);

router.get(
  "/:id",
  authorizationMiddlware("user", true),
  vehicleModelParamsExistValidator,
  vehicleModelRequest,
  vehicleModelControllerInstance.getVehicleById.bind(
    vehicleModelControllerInstance
  )
);

export default router;
