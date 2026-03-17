require('dotenv').config();
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Database connection
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'rootpassword',
    database: process.env.DB_NAME || 'pdv_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Helper route to check DB connection
app.get('/api/health', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT 1');
        res.json({ status: 'ok', db: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', error: error.message });
    }
});

// --- Store Settings ---
app.get('/api/store', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM store_settings LIMIT 1');
        if (rows.length === 0) {
            return res.json({});
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/store', async (req, res) => {
    try {
        const { storeName, storeCnpj, storeAddress, storeHours, storePhone, ownerName, pixKey, pixKeyType } = req.body;
        await pool.query(
            `UPDATE store_settings SET 
            storeName=?, storeCnpj=?, storeAddress=?, storeHours=?, storePhone=?, ownerName=?, pixKey=?, pixKeyType=? 
            WHERE id=1`,
            [storeName, storeCnpj, storeAddress, storeHours, storePhone, ownerName, pixKey, pixKeyType]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Products ---
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    try {
        const { id, name, price, image, category, stock, unit, codigo_barras } = req.body;
        await pool.query(
            'INSERT INTO products (id, name, price, image, category, stock, unit, codigo_barras) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), price=VALUES(price), image=VALUES(image), category=VALUES(category), stock=VALUES(stock), unit=VALUES(unit), codigo_barras=VALUES(codigo_barras)',
            [id, name, price, image, category, stock, unit, codigo_barras]
        );
        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/products/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM products WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Categories ---
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    try {
        const { id, name, color } = req.body;
        await pool.query(
            'INSERT INTO categories (id, name, color) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), color=VALUES(color)',
            [id, name, color]
        );
        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/categories/:id', async (req, res) => {
    try {
        await pool.query('DELETE FROM categories WHERE id = ?', [req.params.id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Customers ---
app.get('/api/customers', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM customers');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/customers', async (req, res) => {
    try {
        const { id, name, phone, cpf, limite_credito, valor_em_aberto } = req.body;
        await pool.query(
            'INSERT INTO customers (id, name, phone, cpf, limite_credito, valor_em_aberto) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=VALUES(name), phone=VALUES(phone), cpf=VALUES(cpf), limite_credito=VALUES(limite_credito), valor_em_aberto=VALUES(valor_em_aberto)',
            [id, name, phone, cpf, limite_credito || 0, valor_em_aberto || 0]
        );
        res.json({ success: true, id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- Sales & Credit Sales ---
app.get('/api/credit-sales', async (req, res) => {
     try {
        const [rows] = await pool.query('SELECT * FROM credit_sales');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/credit-sales', async (req, res) => {
    try {
        const { id, customerId, customerName, amount, status, date, dueDate } = req.body;
        
        // Start transaction
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            await connection.query(
                'INSERT INTO credit_sales (id, customerId, customerName, amount, status, date, dueDate) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, customerId, customerName, amount, status, date, dueDate]
            );
            
            // Update customer open amount
            await connection.query(
                'UPDATE customers SET valor_em_aberto = valor_em_aberto + ? WHERE id = ?',
                [amount, customerId]
            );
            
            await connection.commit();
            res.json({ success: true, id });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Pay a credit sale
app.post('/api/credit-sales/:id/pay', async (req, res) => {
    try {
        const { paymentMethod } = req.body;
        const saleId = req.params.id;
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Get sale amount and customer id
            const [sales] = await connection.query('SELECT amount, customerId FROM credit_sales WHERE id = ?', [saleId]);
            if (sales.length === 0) throw new Error('Sale not found');
            
            const sale = sales[0];
            
            // Mark as paid
            await connection.query(
                'UPDATE credit_sales SET status = ?, paymentMethod = ?, paidAt = NOW() WHERE id = ?',
                ['pago', paymentMethod, saleId]
            );
            
            // Update customer
            await connection.query(
                'UPDATE customers SET valor_em_aberto = GREATEST(0, valor_em_aberto - ?) WHERE id = ?',
                [sale.amount, sale.customerId]
            );
            
            await connection.commit();
            res.json({ success: true });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Record a standard sale
app.post('/api/sales', async (req, res) => {
    try {
        const { id, total, paymentMethod, operatorId, operatorName, customerId, customerName, items } = req.body;
        
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        
        try {
            // Insert Sale
            await connection.query(
                'INSERT INTO sales (id, total, paymentMethod, operatorId, operatorName, customerId, customerName) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id, total, paymentMethod, operatorId, operatorName, customerId, customerName]
            );
            
            // Insert Items
            if (items && items.length > 0) {
                 for (const item of items) {
                     await connection.query(
                         'INSERT INTO sale_items (saleId, productId, productName, price, quantity) VALUES (?, ?, ?, ?, ?)',
                         [id, item.product.id, item.product.name, item.product.price, item.quantity]
                     );
                     
                     // Decrement stock
                     await connection.query(
                         'UPDATE products SET stock = GREATEST(0, stock - ?) WHERE id = ?',
                         [item.quantity, item.product.id]
                     );
                 }
            }
            
            await connection.commit();
            res.json({ success: true, id });
        } catch (err) {
            await connection.rollback();
            throw err;
        } finally {
            connection.release();
        }
        
    } catch (error) {
         res.status(500).json({ error: error.message });
    }
});

// Get sales history
app.get('/api/sales', async (req, res) => {
    try {
        // Here we could add date filters, etc
        const [rows] = await pool.query('SELECT * FROM sales ORDER BY timestamp DESC LIMIT 100');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log('API server running on port ' + PORT);
});
