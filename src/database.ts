import sqlite3 from 'sqlite3';
import { Database, open } from 'sqlite';

let db: Database<sqlite3.Database, sqlite3.Statement> | undefined;

export async function openDb(): Promise<
    Database<sqlite3.Database, sqlite3.Statement>
> {
    sqlite3.verbose();
    db = await open({
        filename: './patient-service.db',
        driver: sqlite3.Database,
    });
    await db.migrate();
    return db;
}

export function closeDb() {
    db?.close();
}

export function getDb() {
    return db;
}
