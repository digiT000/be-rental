// This file serves as an index for all the DTOs related to the Brand entity. It re-exports the types from the individual DTO files, allowing for cleaner and more organized imports in other parts of the application.
export type { CreateBrandRequest } from "./create-request.dto";
export type { UpdateBrandRequest } from "./update-request.dto";
export type { BrandResponse } from "./brand-response.dto";

export { toBrandResponse } from "./mapper";
