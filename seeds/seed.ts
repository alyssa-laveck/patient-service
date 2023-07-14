import fs from 'fs';
import path from 'path';
import { openDb } from '../src/database';
import { PatientRepository, PractitionerRepository } from '../src/repositories';
import { PatientRequest, PractitionerRequest } from '../src/models/DTOs';

async function seedDatabase(): Promise<void> {
    const db = await openDb();
    const patientRepo = new PatientRepository(db);
    const practitionerRepo = new PractitionerRepository(db);

    fs.readFile(
        path.join(__dirname, './input.json'),
        'utf8',
        async (err, data) => {
            if (err) throw err;

            const patients = JSON.parse(data);

            for (const patientData of patients) {
                const practitionerData = patientData.generalPractitioner;
                const practitionerReq: PractitionerRequest = {
                    givenName: practitionerData.given,
                    familyName: practitionerData.family,
                    npi: practitionerData.npi,
                };
                const practitionerId =
                    await practitionerRepo.createPractitioner(practitionerReq);

                const patientReq: PatientRequest = {
                    givenName: patientData.given,
                    familyName: patientData.family,
                    birthDate: patientData.birthDate,
                    appointment: patientData.appointment,
                    mrn: patientData.mrn,
                    location: patientData.location,
                    generalPractitionerId: practitionerId,
                };
                await patientRepo.createPatient(patientReq);
            }
        }
    );
}

seedDatabase().catch((error) => console.error(error));
