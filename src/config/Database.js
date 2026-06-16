import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

class Database {
    static #instance = null;
    #pool;

    constructor() {
        this.#createPool();
    }

    #createPool() {
        this.#pool = mysql.createPool({
            host: process.env.DB_HOST || "localhost",
            user: process.env.DB_USER || "root",
            password: process.env.DB_PASSWORD || "",
            database: process.env.DB_DATABASE,
            port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
    }

    static getInstance() {
        if (!Database.#instance) {
            Database.#instance = new Database();
        }
        return Database.#instance;
    }

    getPool() {
        return this.#pool;
    }
}

const connection = Database.getInstance().getPool();

export { connection };

export async function initializeDatabase() {
    console.log("Inicializando o banco de dados e tabelas...");
    try {
        const tempConnection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            port: process.env.DB_PORT,
            ssl: { rejectUnauthorized: false }
        });


        const dbName = process.env.DB_DATABASE || 'S2_R4_at1';


        await tempConnection.query(`CREATE DATABASE IF NOT EXISTS \`${dbName}\`;`);
        await tempConnection.query(`USE \`${dbName}\`;`);


        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(45) NOT NULL,
                descricao VARCHAR(100) NULL,
                DataCad timestamp
            );
        `);


        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS produtos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                nome VARCHAR(45) NOT NULL,
                valor DECIMAL(10,2) NOT NULL,
                caminhoImg VARCHAR(250),
                DataCad timestamp,
                idCategoria INT,
                FOREIGN KEY (idCategoria) REFERENCES categorias(id)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS pedidos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                SubTotal decimal(18,2),
                Status enum('Aberto', 'Finalizado', 'Pendente'),
                DataCad timestamp,
                IdCliente INT,
                FOREIGN KEY (IdCliente) REFERENCES clientes(id)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS clientes (
                id INT PRIMARY KEY AUTO_INCREMENT,
                Nome VARCHAR(45),
                cpf CHAR(11),
                DataCad timestamp,
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS itens_pedidos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                Quantidade decimal(18,2),
                valorItem decimal(18,2),
                PedidoId INT,
                ProdutoId INT,
                FOREIGN KEY (PedidoId) REFERENCES pedidos(id),
                FOREIGN KEY (ProdutoId) REFERENCES produtos(id)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS enderecos (
                id INT PRIMARY KEY AUTO_INCREMENT,
                Numero INT,
                Logradouro VARCHAR(50),
                Complemento VARCHAR(50),
                Bairro VARCHAR(25),
                Cidade VARCHAR(25),
                Cep CHAR(8),
                Uf CHAR(2),
                IdCliente INT,
                FOREIGN KEY (IdCliente) REFERENCES clientes(id)
            );
        `);

        await tempConnection.query(`
            CREATE TABLE IF NOT EXISTS telefones (
                id INT PRIMARY KEY AUTO_INCREMENT,
                Telefone VARCHAR(11),
                IdCliente INT,
                FOREIGN KEY (IdCliente) REFERENCES clientes(id)
            );
        `);


        await tempConnection.end();
        console.log("Banco de dados e tabelas verificados/criados com sucesso.");
    } catch (error) {
        console.error("Erro ao criar o banco ou as tabelas:", error);
        throw error;
    }
}