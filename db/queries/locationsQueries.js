const pool = require('../pool');


// GET all locations
const getAllLocations = async () => {
  const { rows } = await pool.query(
    `SELECT * FROM locations
     ORDER BY name ASC`
  );
  return rows;
};


// GET a single location by ID
const getLocationById = async (id) => {
  const { rows } = await pool.query(
    `SELECT * FROM locations
     WHERE id = $1`,
    [id]
  );
  return rows[0] ?? null;
};


// GET a location with all its inventory items
const getLocationWithItems = async (id) => {
  const { rows } = await pool.query(
    `SELECT
       l.id           AS location_id,
       l.name         AS location_name,
       l.created_at   AS location_created_at,
       i.id           AS item_id,
       i.name         AS item_name,
       i.sku,
       i.quantity,
       i.price,
       c.name         AS category_name,
       s.name         AS supplier_name
     FROM locations l
     LEFT JOIN inventory_items i ON i.location_id = l.id
     LEFT JOIN categories      c ON c.id = i.category_id
     LEFT JOIN suppliers       s ON s.id = i.supplier_id
     WHERE l.id = $1
     ORDER BY i.name ASC`,
    [id]
  );
  return rows;
};


// SEARCH locations by name (case-insensitive)
const searchLocations = async (searchTerm) => {
  const { rows } = await pool.query(
    `SELECT * FROM locations
     WHERE name ILIKE $1
     ORDER BY name ASC`,
    [`%${searchTerm}%`]
  );
  return rows;
};


// CREATE a new location
const createLocation = async (name) => {
  const { rows } = await pool.query(
    `INSERT INTO locations (name)
     VALUES ($1)
     RETURNING *`,
    [name]
  );
  return rows[0];
};


// UPDATE a location name
const updateLocation = async (id, name) => {
  const { rows } = await pool.query(
    `UPDATE locations
     SET name = $1
     WHERE id = $2
     RETURNING *`,
    [name, id]
  );
  return rows[0] ?? null; // null if ID not found
};


// DELETE a location
// Note: inventory_items.location_id is SET NULL on delete,
// so items at this location will become unlinked.
const deleteLocation = async (id) => {
  const { rows } = await pool.query(
    `DELETE FROM locations
     WHERE id = $1
     RETURNING *`,
    [id]
  );
  return rows[0] ?? null; // null if ID not found
};


// CHECK if a location name already exists (useful for validation)
const locationNameExists = async (name, excludeId = null) => {
  const { rows } = await pool.query(
    `SELECT id FROM locations
     WHERE LOWER(name) = LOWER($1)
       AND ($2::INTEGER IS NULL OR id != $2)`,
    [name, excludeId]
  );
  return rows.length > 0;
};


// GET item count per location (useful for a summary/dashboard)
const getLocationItemCounts = async () => {
  const { rows } = await pool.query(
    `SELECT
       l.id,
       l.name,
       COUNT(i.id)     AS total_items,
       SUM(i.quantity) AS total_units
     FROM locations l
     LEFT JOIN inventory_items i ON i.location_id = l.id
     GROUP BY l.id, l.name
     ORDER BY l.name ASC`
  );
  return rows;
};

module.exports = {
  getAllLocations,
  getLocationById,
  getLocationWithItems,
  searchLocations,
  createLocation,
  updateLocation,
  deleteLocation,
  locationNameExists,
  getLocationItemCounts,
};