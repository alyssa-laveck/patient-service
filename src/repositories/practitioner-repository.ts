import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { PractitionerRequest } from '../models/DTOs';

export class PractitionerRepository {
    private static readonly db: Database<sqlite3.Database, sqlite3.Statement>;

    constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
    }

    public async getAllPractitioners() {
        return this.db.all('SELECT * FROM practitioners;');
    }

    public async createPractitioner(
        practitionerReq: PractitionerRequest
    ): Promise<number> {
        try {
            const { givenName, familyName, npi } = practitionerReq;
            const { lastID: practitionerId } = await this.db.run(
                'INSERT INTO practitioners (given_name, family_name, npi) VALUES (?, ?, ?);',
                givenName,
                familyName,
                npi
            );
            return practitionerId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
