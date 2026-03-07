import pool from '../config/database.js';
import { BrandsTable } from '../types/database.types.js';

interface BrandInput {
  name: string;
  logoUrl: string | null;
}

interface BrandUpdateInput {
  id: number;
  name?: string;
  logo_url?: string;
}

export class BrandsModel {
  async create(brand: BrandInput): Promise<Partial<BrandsTable>> {
    const query = `
     INSERT INTO brands (name, logo_url)
     VALUES ($1, $2)
     RETURNING id, name, logo_url
    `;

    const values = [brand.name, brand.logoUrl];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async update(brands: BrandUpdateInput): Promise<any> {
    let basedQuery = `UPDATE brands`;
    let setClauses: string[] = [];
    let values: any[] = [];
    let paramCount = 1;

    if (brands.name) {
      setClauses.push(`name = $${paramCount++}`);
      values.push(brands.name);
    }

    if (brands.logo_url) {
      setClauses.push(`logo_url = $${paramCount++}`);
      values.push(brands.logo_url);
    }

    if (setClauses.length === 0) {
      return null;
    }

    const updatedQuery = `${basedQuery} SET ${setClauses.join(', ')} WHERE id = $${paramCount}`;
    values.push(brands.id);

    const result = await pool.query(updatedQuery, values);
    return result;
  }
}
