import { Injectable, OnModuleInit } from '@nestjs/common';
import * as mysql from 'mysql2/promise';

@Injectable()
export class DatabaseInitService implements OnModuleInit {
    private connection: mysql.Connection;

    constructor() {
        this.initConnection();
    }

    private async initConnection() {
        this.connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '',
            database: 'demo'
        });
    }

    async onModuleInit() {
        await this.createTables();
    }

    private async createTables() {
        const createItemsTable = `
            CREATE TABLE IF NOT EXISTS items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                item VARCHAR(255) NOT NULL
            );
        `;

        const createCombinationsTable = `
            CREATE TABLE IF NOT EXISTS combinations (
                id INT AUTO_INCREMENT PRIMARY KEY,
                combination JSON NOT NULL
            );
        `;

        const createResponsesTable = `
            CREATE TABLE IF NOT EXISTS responses (
                id INT AUTO_INCREMENT PRIMARY KEY,
                response JSON NOT NULL
            );
        `;

        try {
            await this.connection.execute(createItemsTable);
            await this.connection.execute(createCombinationsTable);
            await this.connection.execute(createResponsesTable);
            console.log('Tables created or already exist.');
        } catch (error) {
            console.error('Error creating tables:', error);
        } finally {
            await this.connection.end(); // Close the connection
        }
    }
}