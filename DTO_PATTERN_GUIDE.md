/**
 * EXAMPLE: How to Implement DTOs for Brand Feature
 * 
 * This is a template/guide for implementing DTOs in other parts of the application.
 * Follow this pattern for brands, vehicles, bookings, etc.
 */

// ========================================
// STEP 1: Create Request DTOs
// File: src/dto/brand/create-brand-request.dto.ts
// ========================================

export interface CreateBrandRequestDTO {
  name: string;
  logo_url?: string;
  description?: string;
}

export interface UpdateBrandRequestDTO {
  id: string; // UUID
  name?: string;
  logo_url?: string;
  description?: string;
}

// ========================================
// STEP 2: Create Response DTOs
// File: src/dto/brand/brand-response.dto.ts
// ========================================

export interface BrandResponseDTO {
  id: string; // UUID
  name: string;
  logo_url: string | null;
  created_at: Date;
  updated_at: Date;
  // is_deleted excluded - internal field
  // deleted_at excluded - internal field
}

// Optional: Nested DTO for related data
export interface BrandWithModelsDTO extends BrandResponseDTO {
  vehicle_models: VehicleModelResponseDTO[];
}

// ========================================
// STEP 3: Create Mapper Functions
// File: src/dto/brand/mappers.ts
// ========================================

import { Brand } from '../../types/database.types.js';
import { BrandResponseDTO } from './brand-response.dto.js';

/**
 * Transforms Brand model to BrandResponseDTO
 * Excludes internal fields like is_deleted
 */
export const toBrandResponse = (brand: Brand): BrandResponseDTO => ({
  id: brand.id,
  name: brand.name,
  logo_url: brand.logo_url,
  created_at: brand.created_at,
  updated_at: brand.updated_at,
  // is_deleted and deleted_at intentionally excluded
});

/**
 * Transforms array of brands to DTOs
 */
export const toBrandResponseList = (brands: Brand[]): BrandResponseDTO[] => {
  return brands.map(toBrandResponse);
};

// ========================================
// STEP 4: Create Index Export
// File: src/dto/brand/index.ts
// ========================================

// Request DTOs
export type { CreateBrandRequestDTO } from './create-brand-request.dto.js';
export type { UpdateBrandRequestDTO } from './update-brand-request.dto.js';

// Response DTOs
export type { BrandResponseDTO, BrandWithModelsDTO } from './brand-response.dto.js';

// Mappers
export { toBrandResponse, toBrandResponseList } from './mappers.js';

// ========================================
// STEP 5: Update Service Layer
// File: src/service/brand.service.ts
// ========================================

import { BrandResponseDTO, toBrandResponse } from '../dto/brand/index.js';

export class BrandService {
  private brandModel: BrandModel;

  constructor() {
    this.brandModel = new BrandModel();
  }

  /**
   * Create brand - returns DTO instead of raw model
   */
  async create(data: CreateBrandRequestDTO): Promise<BrandResponseDTO> {
    const brand = await this.brandModel.create(data);
    return toBrandResponse(brand); // Transform to DTO
  }

  /**
   * Get brand by ID - returns DTO
   */
  async getBrandById(id: string): Promise<BrandResponseDTO | null> {
    const brand = await this.brandModel.findById(id);
    if (!brand) return null;
    return toBrandResponse(brand); // Transform to DTO
  }

  /**
   * Update brand - returns DTO
   */
  async update(id: string, data: UpdateBrandRequestDTO): Promise<BrandResponseDTO> {
    const updated = await this.brandModel.update(id, data);
    return toBrandResponse(updated); // Transform to DTO
  }
}

// ========================================
// STEP 6: Update Controller Layer
// File: src/controller/brand.controller.ts
// ========================================

import { Request, Response } from 'express';
import { BrandService } from '../service/brand.service.js';
import {
  CreateBrandRequestDTO,
  UpdateBrandRequestDTO,
  BrandResponseDTO,
} from '../dto/brand/index.js';

export default class BrandController {
  private brandService: BrandService;

  constructor() {
    this.brandService = new BrandService();
  }

  /**
   * Create brand - type-safe request and response
   */
  createBrand = async (req: Request, res: Response): Promise<Response> => {
    // Type-cast request body to DTO
    const data = req.body as CreateBrandRequestDTO;
    
    // Service returns DTO
    const brand = await this.brandService.create(data);
    
    // Return DTO directly (type-safe)
    return res.status(201).json({
      brand, // BrandResponseDTO
      message: 'Brand created successfully',
    });
  };

  /**
   * Get brand by ID
   */
  getBrandById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    
    const brand = await this.brandService.getBrandById(id);
    
    if (!brand) {
      return res.status(404).json({ error: 'Brand not found' });
    }
    
    // Return DTO
    return res.status(200).json(brand);
  };

  /**
   * Update brand
   */
  updateBrand = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const data = req.body as UpdateBrandRequestDTO;
    
    const brand = await this.brandService.update(id, data);
    
    return res.status(200).json({
      brand,
      message: 'Brand updated successfully',
    });
  };
}

// ========================================
// STEP 7: Create/Update Validators
// File: src/middleware/validation/brand.validator.ts
// ========================================

import { body, ValidationChain } from 'express-validator';

/**
 * Validates CreateBrandRequestDTO
 */
export const createBrandValidator: ValidationChain[] = [
  body('name')
    .notEmpty()
    .withMessage('Brand name is required')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be 2-100 characters'),
  
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be max 500 characters'),
];

/**
 * Validates UpdateBrandRequestDTO
 */
export const updateBrandValidator: ValidationChain[] = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Brand name must be 2-100 characters'),
  
  body('logo_url')
    .optional()
    .isURL()
    .withMessage('Logo URL must be a valid URL'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description must be max 500 characters'),
];

// ========================================
// KEY BENEFITS OF THIS PATTERN
// ========================================

/**
 * 1. TYPE SAFETY
 * - Request bodies are typed (no more `any`)
 * - Responses are consistently typed
 * - IDE autocomplete works everywhere
 * 
 * 2. SECURITY
 * - Sensitive fields explicitly excluded (is_deleted, deleted_at)
 * - Clear separation: internal models vs external API
 * - Prevents accidental data leaks
 * 
 * 3. MAINTAINABILITY
 * - Single source of truth for API contracts
 * - Easy to modify response structure
 * - Database changes don't break API contracts
 * 
 * 4. DOCUMENTATION
 * - DTOs serve as API documentation
 * - Clear what fields are required/optional
 * - Easy for frontend developers to understand
 * 
 * 5. TESTABILITY
 * - Mock DTOs instead of database models
 * - Validate response shapes in tests
 * - Easy to create test fixtures
 */

// ========================================
// COMMON PATTERNS
// ========================================

// Pattern 1: Pagination Response
export interface PaginatedResponseDTO<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Usage:
type BrandListResponse = PaginatedResponseDTO<BrandResponseDTO>;

// Pattern 2: Nested DTOs
export interface VehicleWithBrandDTO {
  id: string;
  name: string;
  brand: BrandResponseDTO; // Nested DTO
  price: number;
}

// Pattern 3: Partial Updates
import { Partial } from 'typescript';

export type PartialUpdateBrandDTO = Partial<CreateBrandRequestDTO> & { id: string };

// Pattern 4: Omit Sensitive Fields
export type PublicUserDTO = Omit<UserResponseDTO, 'email' | 'role'>;

// Pattern 5: Pick Specific Fields
export type BrandSummaryDTO = Pick<BrandResponseDTO, 'id' | 'name'>;
