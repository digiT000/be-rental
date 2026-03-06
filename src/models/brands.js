import db from "../config/postgres.js";

export class BrandsModel {
  async create(brand) {
    const query = `
     INSERT INTO brands (name,logo_url )
     VALUES ($1, $2)
     RETURNING id, name, logo_url
    `;

    const values = [brand.name, brand.logoUrl];
    const result = await db.query(query, values);
    return result.rows[0];
  }

  async update(brands) {
    let basedQuery = `UPDATE brands`;
    let setClauses = [];
    let values = [];
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

    const updatedQuery = `${basedQuery} SET ${setClauses.join(
      ", "
    )} WHERE id = $${paramCount}`;
    values.push(brands.id);

    const result = await this.db.query(updatedQuery, values);
    return result;
  }
}
