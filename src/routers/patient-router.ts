import express from 'express';
import { getDb } from '../database';
import {
    PatientByPractitionerQueryParams,
    PatientQueryParams,
} from '../models/DTOs';
import { PatientRepository } from '../repositories';
import { Patient } from '../models/entities';

export const patientRouter = express.Router();

patientRouter.get('/search', async (req, res) => {
    try {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.status(400).json('Missing Query Params');
        }

        const db = getDb();
        const patientRepo = new PatientRepository(db);
        const { givenName, familyName, birthDate, mrn, location } =
            req.query as PatientQueryParams;

        let patient: Patient | null = null;
        if (givenName && familyName && birthDate) {
            patient = await patientRepo.getPatientByNameAndBirthDate(
                givenName,
                familyName,
                birthDate
            );
        } else if (mrn && location) {
            patient = await patientRepo.getPatientByMrnAndLocation(
                mrn,
                location
            );
        } else {
            return res
                .status(400)
                .send(
                    'Invalid Query Params: must include givenName/familyName/birthDate OR mrn/location'
                );
        }

        if (!patient) {
            return res.status(404).send('Patient Not Found');
        }

        // TODO: DTO
        return res.status(200).json(patient);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unexpected Error');
    }
});

patientRouter.get('/search-by-practitioner', async (req, res) => {
    try {
        if (!req.query || Object.keys(req.query).length === 0) {
            return res.status(400).json('Missing Query Params');
        }

        const db = getDb();
        const patientRepo = new PatientRepository(db);
        const { givenName, familyName, npi, location } =
            req.query as PatientByPractitionerQueryParams;

        let patients: Patient[] = [];
        if (givenName && familyName) {
            patients = await patientRepo.getPatientByPractitionerName(
                givenName,
                familyName
            );
        } else if (npi && location) {
            patients = await patientRepo.getPatientByLocationAndPractitionerNpi(
                location,
                npi
            );
        } else {
            return res
                .status(400)
                .send(
                    "Invalid Query Params: must include practitioner's givenName/familyName OR npi/location"
                );
        }

        // TODO: DTO
        return res.status(200).json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).send('Unexpected Error');
    }
});
