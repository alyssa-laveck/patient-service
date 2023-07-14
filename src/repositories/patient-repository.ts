import sqlite3 from 'sqlite3';
import { Database } from 'sqlite';
import { PatientRequest } from '../models/DTOs';
import { Patient } from '../models/entities';

export class PatientRepository {
    private static readonly db: Database<sqlite3.Database, sqlite3.Statement>;

    constructor(private db: Database<sqlite3.Database, sqlite3.Statement>) {
        this.db = db;
    }

    public async createPatient(patientReq: PatientRequest): Promise<number> {
        try {
            const {
                givenName,
                familyName,
                birthDate,
                appointment,
                mrn,
                location,
                generalPractitionerId,
            } = patientReq;

            const { lastID: patientId } = await this.db.run(
                'INSERT INTO patients (given_name, family_name, birth_date, appointment, mrn, location, general_practitioner_id) VALUES (?, ?, ?, ?, ?, ?, ?);',
                givenName,
                familyName,
                birthDate,
                appointment,
                mrn,
                location,
                generalPractitionerId
            );
            return patientId;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getPatientByNameAndBirthDate(
        givenName: string,
        familyName: string,
        birthDate: string
    ): Promise<Patient | null> {
        try {
            const patient = await this.db.get<Patient>(
                `SELECT *
                FROM patients
                WHERE (
                    given_name = ?
                    AND family_name = ?
                    AND birth_date = ?
                );`,
                givenName,
                familyName,
                birthDate
            );

            return patient || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getPatientByMrnAndLocation(
        mrn: number,
        location: string
    ): Promise<Patient | null> {
        try {
            const patient = await this.db.get<Patient>(
                `SELECT *
                FROM patients
                WHERE (
                    mrn = ?
                    AND location = ?
                );`,
                mrn,
                location
            );

            return patient || null;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getPatientByPractitionerName(
        givenName: string,
        familyName: string
    ): Promise<Patient[]> {
        try {
            const patients = await this.db.all<Patient[]>(
                `SELECT pa.*
                FROM patients pa
                JOIN practitioners pr ON pa.general_practitioner_id = pr.id
                WHERE (
                    pr.given_name = ?
                    AND pr.family_name = ?
                );`,
                givenName,
                familyName
            );

            return patients;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    public async getPatientByLocationAndPractitionerNpi(
        location: string,
        npi: number
    ): Promise<Patient[]> {
        try {
            const patients = await this.db.all<Patient[]>(
                `SELECT pa.*
                FROM patients pa
                JOIN practitioners pr ON pa.general_practitioner_id = pr.id
                WHERE (
                    pa.location = ?
                    AND pr.npi = ?
                );`,
                location,
                npi
            );

            return patients;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}
