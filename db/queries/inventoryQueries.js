const pool = require('../pool');


// Reusable SELECT fragment — joins all FK tables so every
// query returns enriched rows without repeating the joins.
const ITEM_SELECT = `
  SELECT
    i.id,
    i.name,
    i.description,
    i.sku,
    i.quantity,
    i.price,
    i.created_at,
    i.updated_at,
    c.id   AS category_id,
    c.name AS category_name,
    s.id   AS supplier_id,
    s.name AS supplier_name,
    l.id   AS location_id,
    l.name AS location_name
  FROM inventory_items i
  LEFT JOIN categories c ON c.id = i.category_id
  LEFT JOIN suppliers  s ON s.id = i.supplier_id
  LEFT JOIN locations  l ON l.id = i.location_id
`;


// GET all inventory items
const getAllItems = async () => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     ORDER BY i.name ASC`
  );
  return rows;
};


// GET a single item by ID
const getItemById = async (id) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.id = $1`,
    [id]
  );
  return rows[0] ?? null;
};


// GET a single item by SKU
const getItemBySku = async (sku) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.sku = $1`,
    [sku]
  );
  return rows[0] ?? null;
};


// GET items filtered by category
const getItemsByCategory = async (categoryId) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.category_id = $1
     ORDER BY i.name ASC`,
    [categoryId]
  );
  return rows;
};


// GET items filtered by supplier
const getItemsBySupplier = async (supplierId) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.supplier_id = $1
     ORDER BY i.name ASC`,
    [supplierId]
  );
  return rows;
};


// GET items filtered by location
const getItemsByLocation = async (locationId) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.location_id = $1
     ORDER BY i.name ASC`,
    [locationId]
  );
  return rows;
};


// GET low-stock items (quantity at or below a threshold)
// Defaults to 5 if no threshold is passed.
const getLowStockItems = async (threshold = 5) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.quantity <= $1
     ORDER BY i.quantity ASC`,
    [threshold]
  );
  return rows;
};


// SEARCH items by name or description (case-insensitive)
const searchItems = async (searchTerm) => {
  const { rows } = await pool.query(
    `${ITEM_SELECT}
     WHERE i.name        ILIKE $1
        OR i.description ILIKE $1
        OR i.sku         ILIKE $1
     ORDER BY i.name ASC`,
    [`%${searchTerm}%`]
  );
  return rows;
};


// CREATE a new inventory item
const createItem = async ({ name, description, sku, quantity, price, category_id, supplier_id, location_id }) => {
  const { rows } = await pool.query(
    `INSERT INTO inventory_items
       (name, description, sku, quantity, price, category_id, supplier_id, location_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
     RETURNING *`,
    [name, description ?? null, sku ?? null, quantity ?? 0, price ?? null, category_id ?? null, supplier_id ?? null, location_id ?? null]
  );
  return rows[0];
};


// UPDATE an inventory item (full update)
const updateItem = async (id, { name, description, sku, quantity, price, category_id, supplier_id, location_id }) => {
  const { rows } = await pool.query(
    `UPDATE inventory_items
     SET
       name        = $1,
       description = $2,
       sku         = $3,
       quantity    = $4,
       price       = $5,
       category_id = $6,
       supplier_id = $7,
       location_id = $8
     WHERE id = $9
     RETURNING *`,
    [name, description ?? null, sku ?? null, quantity, price ?? null, category_id ?? null, supplier_id ?? null, location_id ?? null, id]
  );
  return rows[0] ?? null; // null if ID not found
};


// UPDATE quantity only (e.g. stock adjustment)
const updateItemQuantity = async (id, quantity) => {
  const { rows } = await pool.query(
    `UPDATE inventory_items
     SET quantity = $1
     WHERE id = $2
     RETURNING *`,
    [quantity, id]
  );
  return rows[0] ?? null;
};


// DELETE an inventory item
const deleteItem = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM inventory_items
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] ?? null;
};

// CHECK if a SKU already exists
const skuExists = async (sku, excludeId = null) => {
  const { rows } = await pool.query(
    `SELECT id FROM inventory_items
     WHERE sku = $1
       AND ($2::INTEGER IS NULL OR id != $2)`,
    [sku, excludeId]
  );
  return rows.length > 0;
};

// GET dashboard statistics for the main page
const getDashboardStats = async () => {
  const { rows: itemStats } = await pool.query(
    `SELECT
       COUNT(DISTINCT id) AS total_items,
       SUM(quantity) AS total_units,
       COALESCE(SUM(quantity * price), 0) AS total_inventory_value,
       COUNT(CASE WHEN quantity <= 5 THEN 1 END) AS low_stock_count
     FROM inventory_items`
  );

  const { rows: categoryStats } = await pool.query(
    `SELECT COUNT(*) AS total_categories FROM categories`
  );

  const { rows: locationStats } = await pool.query(
    `SELECT COUNT(*) AS total_locations FROM locations`
  );

  return {
    totalItems: parseInt(itemStats[0].total_items) || 0,
    totalUnits: parseInt(itemStats[0].total_units) || 0,
    totalInventoryValue: parseFloat(itemStats[0].total_inventory_value) || 0,
    lowStockCount: parseInt(itemStats[0].low_stock_count) || 0,
    totalCategories: parseInt(categoryStats[0].total_categories) || 0,
    totalLocations: parseInt(locationStats[0].total_locations) || 0,
  };
};

module.exports = {
  getAllItems,
  getItemById,
  getItemBySku,
  getItemsByCategory,
  getItemsBySupplier,
  getItemsByLocation,
  getLowStockItems,
  searchItems,
  createItem,
  updateItem,
  updateItemQuantity,
  deleteItem,
  skuExists,
  getDashboardStats,
};