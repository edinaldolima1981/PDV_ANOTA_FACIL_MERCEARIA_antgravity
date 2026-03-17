CREATE DATABASE IF NOT EXISTS pdv_db;
USE pdv_db;

-- Tabela de Configurações da Loja
CREATE TABLE IF NOT EXISTS store_settings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    storeName VARCHAR(255) NOT NULL,
    storeCnpj VARCHAR(20) NOT NULL,
    storeAddress TEXT NOT NULL,
    storeHours VARCHAR(100) NOT NULL,
    storePhone VARCHAR(20) NOT NULL,
    ownerName VARCHAR(255) NOT NULL,
    pixKey VARCHAR(255) NOT NULL,
    pixKeyType VARCHAR(20) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Tabela de Unidades de Medida
CREATE TABLE IF NOT EXISTS units (
    id VARCHAR(50) PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    short_name VARCHAR(10) NOT NULL
);

-- Tabela de Categorias
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) NOT NULL,
    icon VARCHAR(50)
);

-- Tabela de Produtos
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    image TEXT,
    category VARCHAR(50),
    stock INT DEFAULT 0,
    unit VARCHAR(10) DEFAULT 'un',
    codigo_barras VARCHAR(100),
    FOREIGN KEY (category) REFERENCES categories(id) ON DELETE SET NULL
);

-- Tabela de Clientes
CREATE TABLE IF NOT EXISTS customers (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cpf VARCHAR(14),
    limite_credito DECIMAL(10,2) DEFAULT 0.00,
    valor_em_aberto DECIMAL(10,2) DEFAULT 0.00
);

-- Tabela de Logs de Administrador
CREATE TABLE IF NOT EXISTS admin_logs (
    id VARCHAR(50) PRIMARY KEY,
    adminId VARCHAR(50) NOT NULL,
    action VARCHAR(255) NOT NULL,
    details TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Vendas a Prazo (Crédito)
CREATE TABLE IF NOT EXISTS credit_sales (
    id VARCHAR(50) PRIMARY KEY,
    customerId VARCHAR(50) NOT NULL,
    customerName VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    status ENUM('pendente', 'pago', 'atrasado') DEFAULT 'pendente',
    paymentMethod VARCHAR(50),
    date DATE NOT NULL,
    dueDate DATE NOT NULL,
    paidAt TIMESTAMP NULL,
    -- Informações de liberação pelo admin
    adminId VARCHAR(50),
    adminAuthDate TIMESTAMP NULL,
    amountOverLimit DECIMAL(10,2) DEFAULT 0.00,
    adminReason TEXT,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE CASCADE
);

-- Histórico de Vendas (Geral)
CREATE TABLE IF NOT EXISTS sales (
    id VARCHAR(50) PRIMARY KEY,
    total DECIMAL(10,2) NOT NULL,
    paymentMethod VARCHAR(50) NOT NULL,
    operatorId VARCHAR(50) NOT NULL,
    operatorName VARCHAR(255) NOT NULL,
    customerId VARCHAR(50),
    customerName VARCHAR(255),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
);

-- Itens da Venda
CREATE TABLE IF NOT EXISTS sale_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    saleId VARCHAR(50) NOT NULL,
    productId VARCHAR(50) NOT NULL,
    productName VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    quantity INT NOT NULL,
    FOREIGN KEY (saleId) REFERENCES sales(id) ON DELETE CASCADE,
    FOREIGN KEY (productId) REFERENCES products(id) ON DELETE NO ACTION
);

-- Inserindo dados iniciais padrão
INSERT IGNORE INTO store_settings (id, storeName, storeCnpj, storeAddress, storeHours, storePhone, ownerName, pixKey, pixKeyType) 
VALUES (1, 'Empório Orgânico', '12.345.678/0001-90', 'Rua das Flores, 123 - Centro', '08:00 - 22:00', '(11) 3333-4444', 'Proprietário', '95193258300', 'cpf');

INSERT IGNORE INTO units (id, label, short_name) VALUES 
('un', 'Unidade', 'un'),
('kg', 'Quilograma', 'kg'),
('L', 'Litro', 'L'),
('m', 'Metro', 'm'),
('m2', 'Metro²', 'm²'),
('peca', 'Peça', 'pç'),
('par', 'Par', 'par'),
('saco', 'Saco', 'sc'),
('duzia', 'Dúzia', 'dz'),
('cx', 'Caixa', 'cx');

INSERT IGNORE INTO categories (id, name, color) VALUES 
('hortifruti', 'Hortifruti', 'bg-emerald-100 text-emerald-700'),
('mercearia', 'Mercearia', 'bg-amber-100 text-amber-700'),
('bebidas', 'Bebidas', 'bg-blue-100 text-blue-700'),
('limpeza', 'Limpeza', 'bg-cyan-100 text-cyan-700'),
('padaria', 'Padaria', 'bg-orange-100 text-orange-700');
