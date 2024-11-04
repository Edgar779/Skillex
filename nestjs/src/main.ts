import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as mysql from 'mysql2/promise';

async function createDatabase() {
  const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
  });

  try {
    const [rows]: any[] = await connection.query("SHOW DATABASES LIKE 'demo';");
    if (rows.length === 0) {
      await connection.query('CREATE DATABASE demo;');
      console.log('Database "demo" created successfully!');
    } else {
      console.log('Database "demo" already exists.');
    }
  } catch (error) {
    console.error('Error during database creation:', error);
  } finally {
    await connection.end();
  }
}

async function bootstrap() {
  await createDatabase(); // Ensure the database exists before NestJS app starts
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
