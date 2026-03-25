require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection configuration
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'pdv_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

let pool;
let sqliteDb;
const isDev = true;

async function connectDB() {
    try {
        pool = mysql.createPool(dbConfig);
        await pool.query('SELECT 1');
        console.log('✅ Connected to MySQL Database');
    } catch (error) {
        console.error('❌ Failed to connect to MySQL:', error.message);
        console.log('⚠️ Falling back to SQLite for local development...');
        const sqlite3 = require('sqlite3').verbose();
        sqliteDb = new sqlite3.Database('./dev_db.sqlite', (err) => {
            if (err) console.error('❌ Failed to create SQLite DB:', err.message);
            else {
                console.log('✅ Connected to local SQLite database (dev_db.sqlite)');
                initSqlite();
            }
        });
    }
}

function initSqlite() {
    sqliteDb.serialize(() => {
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS stores (id TEXT PRIMARY KEY, name TEXT, cnpj TEXT, address TEXT, phone TEXT, owner_name TEXT, pix_key TEXT, pix_key_type TEXT, plan_type TEXT, status TEXT, features TEXT)`);
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS categories (id TEXT PRIMARY KEY, store_id TEXT, name TEXT, color TEXT, icon TEXT)`);
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS products (id TEXT PRIMARY KEY, store_id TEXT, name TEXT, price REAL, image TEXT, category_id TEXT, stock REAL, unit TEXT, codigo_barras TEXT)`);
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS customers (id TEXT PRIMARY KEY, store_id TEXT, name TEXT, phone TEXT, cpf TEXT, limite_credito REAL, valor_em_aberto REAL)`);
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS sales (id TEXT PRIMARY KEY, store_id TEXT, total REAL, paymentMethod TEXT, operatorId TEXT, operatorName TEXT, customerId TEXT, customerName TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP)`);
        sqliteDb.run(`CREATE TABLE IF NOT EXISTS sale_items (id INTEGER PRIMARY KEY AUTOINCREMENT, saleId TEXT, productId TEXT, productName TEXT, price REAL, quantity REAL)`);
        
        sqliteDb.run(`INSERT OR IGNORE INTO stores (id, name, cnpj) VALUES ('emporio-organico', 'Empório Orgânico', '12.345.678/0001-90')`);
    });
}

// Universal Query Helper
async function query(sql, params = []) {
    if (pool) {
        return pool.query(sql, params);
    } else if (sqliteDb) {
        return new Promise((resolve, reject) => {
            const isSelect = sql.trim().toUpperCase().startsWith('SELECT');
            const sqliteSql = sql.replace(/ON DUPLICATE KEY UPDATE.*/gi, '').replace(/\?/g, '?');
            
            if (isSelect) {
                sqliteDb.all(sql, params, (err, rows) => {
                    if (err) reject(err);
                    else resolve([rows]);
                });
            } else {
                // Simplificação: SQLite usa INSERT OR REPLACE para ON DUPLICATE KEY
                const finalSql = sql.includes('INSERT INTO') ? sql.replace('INSERT INTO', 'INSERT OR REPLACE INTO').split('ON DUPLICATE')[0] : sql;
                sqliteDb.run(finalSql, params, function(err) {
                    if (err) reject(err);
                    else resolve({ insertId: this.lastID, affectedRows: this.changes });
                });
            }
        });
    }
    throw new Error('No database connection available');
}

connectDB();

// Middleware to ensure store isolation
const tenantContext = (req, res, next) => {
    const storeId = req.headers['x-store-id'] || 'emporio-organico'; // Default for dev test
    req.store_id = storeId;
    next();
};

app.use(tenantContext);

// --- Health ---
app.get('/api/health', async (req, res) => {
    try {
        await query('SELECT 1');
        res.json({ status: 'ok', db: pool ? 'mysql' : 'sqlite', tenant: req.store_id });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// --- Stores (Multi-tenant) ---
app.get('/api/store', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM stores WHERE id = ?', [req.store_id]);
        if (!rows || rows.length === 0) return res.json({ id: req.store_id, name: 'Nova Loja', features: {} });
        const store = rows[0];
        if (typeof store.features === 'string') store.features = JSON.parse(store.features);
        res.json(store);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/store', async (req, res) => {
    try {
        const { name, cnpj, address, phone, owner_name, pix_key, pix_key_type, features } = req.body;
        const featuresJson = typeof features === 'object' ? JSON.stringify(features) : features;
        await query(
            `INSERT INTO stores (id, name, cnpj, address, phone, owner_name, pix_key, pix_key_type, features) 
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
             ON DUPLICATE KEY UPDATE name=VALUES(name), cnpj=VALUES(cnpj), address=VALUES(address), phone=VALUES(phone), owner_name=VALUES(owner_name), pix_key=VALUES(pix_key), pix_key_type=VALUES(pix_key_type), features=VALUES(features)`,
            [req.store_id, name, cnpj, address, phone, owner_name, pix_key, pix_key_type, featuresJson]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Products (Filtered by Store) ---
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM products WHERE store_id = ?', [req.store_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { id, name, price, image, category_id, stock, unit, codigo_barras } = req.body;
        await query(
            'INSERT INTO products (id, store_id, name, price, image, category_id, stock, unit, codigo_barras) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image), category_id=VALUES(category_id), stock=VALUES(stock), unit=VALUES(unit), codigo_barras=VALUES(codigo_barras)',
            [id, req.store_id, name, price, image, category_id, stock, unit, codigo_barras]
        );
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving product:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await query('DELETE FROM products WHERE id = ? AND store_id = ?', [req.params.id, req.store_id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Categories ---
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM categories WHERE store_id = ?', [req.store_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { id, name, color, icon } = req.body;
        await query(
            'INSERT INTO categories (id, store_id, name, color, icon) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color), icon=VALUES(icon)',
            [id, req.store_id, name, color, icon]
        );
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error saving category:', error);
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await query('DELETE FROM categories WHERE id = ? AND store_id = ?', [req.params.id, req.store_id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Customers ---
app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM customers WHERE store_id = ?', [req.store_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { id, name, phone, cpf, limite_credito, valor_em_aberto } = req.body;
        await query(
            'INSERT INTO customers (id, store_id, name, phone, cpf, limite_credito, valor_em_aberto) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), cpf=VALUES(cpf), limite_credito=VALUES(limite_credito), valor_em_aberto=VALUES(valor_em_aberto)',
            [id, req.store_id, name, phone, cpf, limite_credito || 0, valor_em_aberto || 0]
        );
        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Sales & Credit Sales ---
app.get('/api/credit-sales', async (req, res) => {
     try {
        const [rows] = await query('SELECT * FROM credit_sales WHERE store_id = ?', [req.store_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/credit-sales', async (req, res) => {
    try {
        const { id, customerId, customerName, amount, status, date, dueDate } = req.body;
        await query(
            'INSERT INTO credit_sales (id, store_id, customerId, customerName, amount, status, date, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, req.store_id, customerId, customerName, amount, status, date, dueDate]
        );
        await query(
            'UPDATE customers SET valor_em_aberto = valor_em_aberto + ? WHERE id = ? AND store_id = ?',
            [amount, customerId, req.store_id]
        );
        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/sales', async (req, res) => {
    try {
        const { id, total, paymentMethod, operatorId, operatorName, customerId, customerName, items } = req.body;
        await query(
            'INSERT INTO sales (id, store_id, total, paymentMethod, operatorId, operatorName, customerId, customerName) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [id, req.store_id, total, paymentMethod, operatorId, operatorName, customerId || null, customerName || null]
        );
        if (items && items.length > 0) {
             for (const item of items) {
                 await query(
                     'INSERT INTO sale_items (saleId, productId, productName, price, quantity) VALUES (?, ?, ?, ?, ?)',
                     [id, item.product.id, item.product.name, item.product.price, item.quantity]
                 );
                 await query(
                     'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ? AND store_id = ?',
                     [item.quantity, item.product.id, req.store_id]
                 );
             }
        }
        res.json({ success: true, id });
    } catch (error) {
        console.error('Error recording sale:', error);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/sales', async (req, res) => {
    try {
        const [rows] = await query('SELECT * FROM sales WHERE store_id = ? ORDER BY timestamp DESC LIMIT 100', [req.store_id]);
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('API server running on port ' + PORT);
});
