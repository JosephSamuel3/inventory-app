const pool = require('../pool');


// GET all categories
const getAllCategories = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM categories
     ORDER BY name ASC`
  );
  return rows;
};


// GET a single category by ID
const getCategoryById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM categories 
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};


// GET a category with all its inventory items
const getCategoryWithItems = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       c.id           AS category_id,
       c.name         AS category_name,
       c.created_at   AS category_created_at,
       i.id           AS item_id,
       i.name         AS item_name,
       i.sku,
       i.quantity,
       i.price
     FROM categories c
     LEFT JOIN inventory_items i ON i.category_id = c.id
     WHERE c.id = $1
     ORDER BY i.name ASC`,
    [id]
  );
  return rows; // multiple rows, one per item (or one row with nulls if no items)
};


// CREATE a new category
const createCategory = async (name) => {
  const { rows } = await pool.query(
    `INSERT INTO categories (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );
  return rows[0];
};


// UPDATE a category name
const updateCategory = async (id, name) => {
  const { rows } = await pool.query(
    `UPDATE categories
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );
  return rows[0] ?? null; // null if ID not found
};


// DELETE a category
// Note: inventory_items.category_id is SET NULL on delete,
// so items in this category will become uncategorised.
const deleteCategory = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM categories
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] ?? null; // null if ID not found
};


// CHECK if a category name already exists (useful for validation)
const categoryNameExists = async (name, excludeId = null) => {
  const { rows } = await pool.query(
    `SELECT id FROM categories
     WHERE LOWER(name) = LOWER($1)
       AND ($2::INTEGER IS NULL OR id != $2)`,
    [name, excludeId]
  );
  return rows.length > 0;
};

module.exports = {
  getAllCategories,
  getCategoryById,
  getCategoryWithItems,
  createCategory,
  updateCategory,
  deleteCategory,
  categoryNameExists,
};