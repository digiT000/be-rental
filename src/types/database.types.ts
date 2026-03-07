import { Generated, Insertable, Selectable, Updateable } from "kysely";

// Database table interfaces
export interface Database {
  users: UsersTable;
  user_token: UserTokenTable;
  brands: BrandsTable;
  vehicle_models: VehicleModelsTable;
}

export interface UsersTable {
  id: Generated<string>;
  name: string;
  email: string;
  password: string;
  role: "user" | "admin" | "super_admin";
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface UserTokenTable {
  id: Generated<string>;
  refresh_token: string;
  user_id: string;
  valid_until: Date;
  revoked: boolean;
  revoked_at: Date | null;
  revoked_reason: string | null;
  device_info: string;
  created_at: Generated<Date>;
}

export interface BrandsTable {
  id: Generated<string>;
  name: string;
  logo_url: string;
  is_deleted: boolean;
  deleted_at: Generated<Date> | null;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

export interface VehicleModelsTable {
  id: Generated<string>;
  name: string;
  brand_id: string;
  created_at: Generated<Date>;
  updated_at: Generated<Date>;
}

// Kysely helper types
export type User = Selectable<UsersTable>;
export type NewUser = Insertable<UsersTable>;
export type UserUpdate = Updateable<UsersTable>;

export type UserToken = Selectable<UserTokenTable>;
export type NewUserToken = Insertable<UserTokenTable>;
export type UserTokenUpdate = Updateable<UserTokenTable>;

export type Brand = Selectable<BrandsTable>;
export type NewBrand = Insertable<BrandsTable>;
export type BrandUpdate = Updateable<BrandsTable>;

export type VehicleModel = Selectable<VehicleModelsTable>;
export type NewVehicleModel = Insertable<VehicleModelsTable>;
export type VehicleModelUpdate = Updateable<VehicleModelsTable>;
