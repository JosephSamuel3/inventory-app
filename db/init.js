const pool = require('./pool');

// ============================================================
// Schema — drops & recreates all tables
// ============================================================
const schema = `
  DROP TABLE IF EXISTS inventory_items;
  DROP TABLE IF EXISTS categories;
  DROP TABLE IF EXISTS suppliers;
  DROP TABLE IF EXISTS locations;

  CREATE TABLE categories (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(100) UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE suppliers (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    email      VARCHAR(255),
    phone      VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE locations (
    id         SERIAL PRIMARY KEY,
    name       VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE inventory_items (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    description TEXT,
    sku         VARCHAR(100) UNIQUE,
    quantity    INTEGER      NOT NULL DEFAULT 0,
    price       NUMERIC(10,2),
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    supplier_id INTEGER REFERENCES suppliers(id)  ON DELETE SET NULL,
    location_id INTEGER REFERENCES locations(id)  ON DELETE SET NULL,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE OR REPLACE FUNCTION set_updated_at()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trg_inventory_items_updated_at ON inventory_items;
  CREATE TRIGGER trg_inventory_items_updated_at
  BEFORE UPDATE ON inventory_items
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();
`;

// ============================================================
// Seed data
// ============================================================
const seedCategories = `
  INSERT INTO categories (name) VALUES
    ('Laptop'),
    ('Monitor'),
    ('Keyboard'),
    ('Mouse'),
    ('Headset'),
    ('Docking Station');
`;

const seedSuppliers = `
  INSERT INTO suppliers (name, email, phone) VALUES
    ('Dell',     'orders@dell.com',       '1-800-999-3355'),
    ('Logitech', 'support@logitech.com',  '1-646-454-3200'),
    ('Amazon',   'business@amazon.com',   '1-888-280-4331'),
    ('Apple',    'business@apple.com',    '1-800-854-3680'),
    ('LG',       'b2b@lg.com',            '1-800-243-0000');
`;

const seedLocations = `
  INSERT INTO locations (name) VALUES
    ('Office A'),
    ('Office B'),
    ('Storage Room'),
    ('Desk 12'),
    ('Desk 24'),
    ('Server Closet');
`;

const seedInventory = `
  INSERT INTO inventory_items (name, description, sku, quantity, price, category_id, supplier_id, location_id) VALUES
    (
      'Dell XPS 15 Laptop',
      '15.6" OLED display, Intel Core i7, 16GB RAM, 512GB SSD',
      'LPT-DELL-XPS15-001', 5, 1899.99,
      (SELECT id FROM categories WHERE name = 'Laptop'),
      (SELECT id FROM suppliers  WHERE name = 'Dell'),
      (SELECT id FROM locations  WHERE name = 'Storage Room')
    ),
    (
      'Apple MacBook Pro 14"',
      'M3 Pro chip, 18GB unified memory, 512GB SSD, Space Black',
      'LPT-AAPL-MBP14-001', 3, 1999.00,
      (SELECT id FROM categories WHERE name = 'Laptop'),
      (SELECT id FROM suppliers  WHERE name = 'Apple'),
      (SELECT id FROM locations  WHERE name = 'Office A')
    ),
    (
      'Dell UltraSharp 27" Monitor',
      '4K UHD IPS panel, USB-C 90W charging, height-adjustable stand',
      'MON-DELL-U2723D-001', 8, 649.99,
      (SELECT id FROM categories WHERE name = 'Monitor'),
      (SELECT id FROM suppliers  WHERE name = 'Dell'),
      (SELECT id FROM locations  WHERE name = 'Office A')
    ),
    (
      'LG 32" 4K Monitor',
      'UHD IPS display, AMD FreeSync, HDMI & DisplayPort',
      'MON-LG-32UN880-001', 4, 499.99,
      (SELECT id FROM categories WHERE name = 'Monitor'),
      (SELECT id FROM suppliers  WHERE name = 'LG'),
      (SELECT id FROM locations  WHERE name = 'Office B')
    ),
    (
      'Logitech MX Keys Keyboard',
      'Wireless, backlit, multi-device Bluetooth, USB-C rechargeable',
      'KBD-LOGI-MXKEYS-001', 12, 109.99,
      (SELECT id FROM categories WHERE name = 'Keyboard'),
      (SELECT id FROM suppliers  WHERE name = 'Logitech'),
      (SELECT id FROM locations  WHERE name = 'Storage Room')
    ),
    (
      'Logitech MX Master 3S Mouse',
      'Ergonomic wireless mouse, 8K DPI, quiet clicks, USB-C',
      'MOU-LOGI-MXM3S-001', 15, 99.99,
      (SELECT id FROM categories WHERE name = 'Mouse'),
      (SELECT id FROM suppliers  WHERE name = 'Logitech'),
      (SELECT id FROM locations  WHERE name = 'Storage Room')
    ),
    (
      'Logitech H390 USB Headset',
      'Wired USB headset, noise-cancelling mic, in-line controls',
      'HST-LOGI-H390-001', 10, 39.99,
      (SELECT id FROM categories WHERE name = 'Headset'),
      (SELECT id FROM suppliers  WHERE name = 'Logitech'),
      (SELECT id FROM locations  WHERE name = 'Storage Room')
    ),
    (
      'Dell WD19S Docking Station',
      '130W USB-C dock, dual 4K support, 3x USB-A, HDMI, DP',
      'DCK-DELL-WD19S-001', 6, 249.99,
      (SELECT id FROM categories WHERE name = 'Docking Station'),
      (SELECT id FROM suppliers  WHERE name = 'Dell'),
      (SELECT id FROM locations  WHERE name = 'Office A')
    );
`;

// ============================================================
// Run
// ============================================================
async function init() {
  const client = await pool.connect();

  try {
    console.log('⏳ Creating tables...');
    await client.query(schema);
    console.log('✅ Tables created.');

    console.log('⏳ Seeding categories...');
    await client.query(seedCategories);
    console.log('✅ Categories seeded.');

    console.log('⏳ Seeding suppliers...');
    await client.query(seedSuppliers);
    console.log('✅ Suppliers seeded.');

    console.log('⏳ Seeding locations...');
    await client.query(seedLocations);
    console.log('✅ Locations seeded.');

    console.log('⏳ Seeding inventory items...');
    await client.query(seedInventory);
    console.log('✅ Inventory items seeded.');

    console.log('\n🎉 Database initialized successfully!');
  } catch (err) {
    console.error('❌ Initialization failed:', err.message);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

init();