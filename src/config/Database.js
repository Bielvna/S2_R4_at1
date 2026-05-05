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