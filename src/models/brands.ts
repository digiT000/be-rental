import { UUID } from "node:crypto";
import { db } from "../config/database.js";
import { Brand } from "../types/database.types.js";
import { NotFoundError } from "../utils/appError.js";
import { OptionPagination } from "../types/express.js";

interface BrandInput {
  name: string;
  logoUrl: string | null;
}

interface BrandUpdateInput {
  id: string;
  name?: string;
  logoUrl?: string | null;
}

export class BrandsModel {
  async create(
    brand: BrandInput
  ): Promise<
    Omit<Brand, "created_at" | "updated_at" | "is_deleted" | "deleted_at">
  > {
    const result = await db
      .insertInto("brands")
      .values({
        name: brand.name,
        logo_url: brand.logoUrl,
        is_deleted: false,
      })
      .returning(["id", "name", "logo_url"])
      .executeTakeFirstOrThrow();

    return result;
  }

  async update(brand: BrandUpdateInput) {
    const id = brand.id as UUID;
    const data: { name?: string; logo_url?: string | null } = {};

    if (brand.name) {
      data.name = brand.name;
    }

    if (brand.logoUrl) {
      data.logo_url = brand.logoUrl;
    }

    const result = await db
      .updateTable("brands")
      .set(data)
      .where("id", "=", id)
      .returning(["id", "name", "logo_url"])
      .executeTakeFirstOrThrow();

    return result;
  }

  async delete(id: string) {
    const brandId = id as UUID;
    await db
      .updateTable("brands")
      .set({
        is_deleted: true,
        deleted_at: new Date(),
      })
      .where("id", "=", brandId)
      .executeTakeFirstOrThrow();
  }

  async findById(
    id: UUID
  ): Promise<Pick<Brand, "id" | "name" | "logo_url"> | undefined> {
    const brandId = id as UUID;
    const result = await db
      .selectFrom("brands")
      .select(["id", "name", "logo_url"])
      .where("id", "=", brandId)
      .where("is_deleted", "=", false)
      .where("deleted_at", "is", null)
      .executeTakeFirst();

    if (!result) {
      throw new NotFoundError("Brand is not exist");
    } else return result;
  }

  async get(options: OptionPagination) {
    const skip = options.page * 10;

    return await db
      .selectFrom("brands")
      .select(["id", "name", "logo_url"])
      .limit(options.limit)
      .where("is_deleted", "=", false)
      .where("deleted_at", "is", null)
      .offset(skip)
      .execute();
  }
}
