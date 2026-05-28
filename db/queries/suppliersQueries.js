const pool = require("../pool")


//GET all suppliers
const getAllSuppliers = async () => {
    const { rows } = await pool.query(
       `SELECT * FROM suppliers 
       ORDER BY name ASC` 
    );
    return rows;
};

// GET a single supplier by ID
const getSupplierById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM suppliers
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};
 

// GET a supplier with all its inventory items
const getSupplierWithItems = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       s.id           AS supplier_id,
       s.name         AS supplier_name,
       s.email        AS supplier_email,
       s.phone        AS supplier_phone,
       s.created_at   AS supplier_created_at,
       i.id           AS item_id,
       i.name         AS item_name,
       i.sku,
       i.quantity,
       i.price,
       c.name         AS category_name,
       l.name         AS location_name
     FROM suppliers s
     LEFT JOIN inventory_items i ON i.supplier_id = s.id
     LEFT JOIN categories      c ON c.id = i.category_id
     LEFT JOIN locations       l ON l.id = i.location_id
     WHERE s.id = $1
     ORDER BY i.name ASC`,
    [id]
  );
  return rows;
};
 

// SEARCH suppliers by name (case-insensitive)
const searchSuppliers = async (searchTerm) => {
  const { rows } = await pool.query(
    `SELECT * FROM suppliers
     WHERE name  ILIKE $1
        OR email ILIKE $1
     ORDER BY name ASC`,
    [`%${searchTerm}%`]
  );
  return rows;
};
 

// CREATE a new supplier
const createSupplier = async ({ name, email, phone }) => {
  const { rows } = await pool.query(
    `INSERT INTO suppliers (name, email, phone)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [name, email ?? null, phone ?? null]
  );
  return rows[0];
};
 

// UPDATE a supplier (full update)
const updateSupplier = async (id, { name, email, phone }) => {
  const { rows } = await pool.query(
    `UPDATE suppliers
     SET
       name  = $1,
       email = $2,
       phone = $3
     WHERE id = $4
     RETURNING *`,
    [name, email ?? null, phone ?? null, id]
  );
  return rows[0] ?? null; // null if ID not found
};
 

// DELETE a supplier
// Note: inventory_items.supplier_id is SET NULL on delete,
// so items from this supplier will become unlinked.
const deleteSupplier = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM suppliers
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] ?? null; // null if ID not found
};
 

// CHECK if a supplier name already exists (useful for validation)
const supplierNameExists = async (name, excludeId = null) => {
  const { rows } = await pool.query(
    `SELECT id FROM suppliers
     WHERE LOWER(name) = LOWER($1)
       AND ($2::INTEGER IS NULL OR id != $2)`,
    [name, excludeId]
  );
  return rows.length > 0;
};
 

// GET item count per supplier (useful for a summary/dashboard)
const getSupplierItemCounts = async () => {
  const { rows } = await pool.query(
    `SELECT
       s.id,
       s.name,
       COUNT(i.id)   AS total_items,
       SUM(i.quantity) AS total_units
     FROM suppliers s
     LEFT JOIN inventory_items i ON i.supplier_id = s.id
     GROUP BY s.id, s.name
     ORDER BY s.name ASC`
  );
  return rows;
};
 
module.exports = {
  getAllSuppliers,
  getSupplierById,
  getSupplierWithItems,
  searchSuppliers,
  createSupplier,
  updateSupplier,
  deleteSupplier,
  supplierNameExists,
  getSupplierItemCounts,
};