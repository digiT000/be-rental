import { db } from "../config/database";
import { VehicleModel, VehicleType } from "../types/database.types";

interface VehicleModelInput {
  brandId: string;
  name: string;
  pricePerDay: number;
  year: number;
  imageUrl: string;
  type: VehicleType;
  features: Record<string, any> | null;
}

interface VehicleModelUpdateInput {
  brandId?: string;
  name?: string;
  pricePerDay?: number;
  year?: number;
  imageUrl?: string;
  type?: VehicleType;
  features?: Record<string, any> | null;
}

export class VehicleModels {
  async create(
    vehicle: VehicleModelInput
  ): Promise<
    Omit<
      VehicleModel,
      "created_at" | "updated_at" | "is_deleted" | "deleted_at"
    >
  > {
    const result = await db
      .insertInto("vehicle_models")
      .values({
        brand_id: vehicle.brandId,
        name: vehicle.name,
        price_per_day: vehicle.pricePerDay,
        year: vehicle.year,
        image_url: vehicle.imageUrl,
        type: vehicle.type,
        features: vehicle.features,
        is_deleted: false,
      })
      .returning([
        "id",
        "brand_id",
        "name",
        "price_per_day",
        "year",
        "image_url",
        "type",
        "features",
      ])
      .executeTakeFirstOrThrow();

    return result;
  }

  async update(
    id: string,
    vehicle: VehicleModelUpdateInput
  ): Promise<
    Omit<
      VehicleModel,
      "created_at" | "updated_at" | "is_deleted" | "deleted_at"
    >
  > {
    const data: VehicleModelUpdateInput = {};

    if (vehicle.brandId) {
      data.brandId = vehicle.brandId;
    }
    if (vehicle.name) {
      data.name = vehicle.name;
    }
    if (vehicle.pricePerDay) {
      data.pricePerDay = vehicle.pricePerDay;
    }
    if (vehicle.year) {
      data.year = vehicle.year;
    }
    if (vehicle.imageUrl) {
      data.imageUrl = vehicle.imageUrl;
    }
    if (vehicle.type) {
      data.type = vehicle.type;
    }
    if (vehicle.features) {
      data.features = vehicle.features;
    }

    const result = await db
      .updateTable("vehicle_models")
      .set(data)
      .where("id", "=", id)
      .returning([
        "id",
        "brand_id",
        "name",
        "price_per_day",
        "year",
        "image_url",
        "type",
        "features",
      ])
      .executeTakeFirstOrThrow();
    return result;
  }

  async delete(
    id: string
  ): Promise<Pick<VehicleModel, "id" | "updated_at" | "is_deleted">> {
    return await db
      .updateTable("vehicle_models")
      .set({
        is_deleted: true,
        deleted_at: new Date(),
      })
      .where("id", "=", id)
      .returning(["id", "updated_at", "is_deleted"])
      .executeTakeFirstOrThrow();
  }

  async findById(id: string) {
    return await db
      .selectFrom("vehicle_models")
      .innerJoin("brands", "vehicle_models.brand_id", "brands.id")
      .where("id", "=", id)
      .where("is_deleted", "=", false)
      .where("deleted_at", "is", null)
      .executeTakeFirstOrThrow();
  }
}
