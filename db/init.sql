CREATE DATABASE IF NOT EXISTS pdv_db;
USE pdv_db;

-- Tabela de Estabelecimentos (Tenants)
CREATE TABLE IF NOT EXISTS stores (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    cnpj VARCHAR(20) NOT NULL,
    address TEXT,
    phone VARCHAR(20),
    owner_name VARCHAR(255),
    pix_key VARCHAR(255),
    pix_key_type VARCHAR(20),
    plan_type ENUM('free', 'pro', 'enterprise') DEFAULT 'free',
    status ENUM('active', 'inactive', 'suspended') DEFAULT 'active',
    features JSON, -- Módulos ativos (ex: {"restaurant": true})
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Categorias (Multi-tenant)
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    icon VARCHAR(50),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Tabela de Produtos (Multi-tenant)
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category_id VARCHAR(50),
    stock DECIMAL(10,3) DEFAULT 0,
    unit VARCHAR(10) DEFAULT 'un',
    codigo_barras VARCHAR(100),
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de Clientes (Multi-tenant)
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14),
    limite_credito DECIMAL(10,2) DEFAULT 0.00,
    valor_em_aberto DECIMAL(10,2) DEFAULT 0.00,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE
);

-- Tabela de Vendas (Multi-tenant)
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    total DECIMAL(10,2) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    operatorId VARCHAR(50) NOT NULL,
    operatorName VARCHAR(255) NOT NULL,
    customerId VARCHAR(50),
    customerName VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
);

-- Itens da Venda
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saleId VARCHAR(50) NOT NULL,
    productId VARCHAR(50) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity DECIMAL(10,3) NOT NULL,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE
);

-- Vendas a Prazo (Multi-tenant)
CREATE TABLE IF NOT EXISTS credit_sales (
    id VARCHAR(50) PRIMARY KEY,
    store_id VARCHAR(50) NOT NULL,
    customerId VARCHAR(50) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'pago', 'atrasado') DEFAULT 'pendente',
    paymentMethod VARCHAR(50),
    date DATE NOT NULL,
    dueDate DATE NOT NULL,
    paidAt TIMESTAMP NULL,
    FOREIGN KEY (store_id) REFERENCES stores(id) ON DELETE CASCADE,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

-- Inserindo loja padrão para testes
INSERT IGNORE INTO stores (id, name, cnpj, address, phone, owner_name, pix_key, pix_key_type) 
VALUES ('emporio-organico', 'Empório Orgânico', '12.345.678/0001-90', 'Rua das Flores, 123', '(11) 3333-4444', 'Proprietário', '95193258300', 'cpf');

-- Inserindo categorias para a loja padrão
INSERT IGNORE INTO categories (id, store_id, name, color) VALUES 
('hortifruti', 'emporio-organico', 'Hortifruti', 'bg-emerald-100 text-emerald-700'),
('mercearia', 'emporio-organico', 'Mercearia', 'bg-amber-100 text-amber-700');
