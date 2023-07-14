import supertest from 'supertest';
import app from '../src/app';
import { closeDb, openDb } from '../src/database';

const request = supertest(app);

describe('Patient Router', () => {
    beforeAll(async () => {
        await openDb();
    });

    afterAll(() => {
        closeDb();
    });

    describe('GET /patients/search', () => {
        it('should return 400 if no query params are provided', async () => {
            const res = await request.get('/patients/search').send();
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 if invalid query params are provided', async () => {
            const res = await request.get('/patients/search?badParam=BAD');
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 if partial query params are provided', async () => {
            const paths = [
                '/patients/search?givenName=BAD',
                '/patients/search?familyName=BAD',
                '/patients/search?birthDate=BAD',
                '/patients/search?givenName=BAD&familyName=BAD',
                '/patients/search?givenName=BAD&birthDate=BAD',
                '/patients/search?familyName=BAD&birthDate=BAD',
                '/patients/search?mrn=BAD',
                '/patients/search?location=BAD',
            ];

            for (const path of paths) {
                const res = await request.get(path);
                expect(res.statusCode).toEqual(400);
            }
        });

        it('should return 404 if no patient is found by name and birth date', async () => {
            const res = await request.get(
                '/patients/search?givenName=BAD&familyName=BAD&birthDate=BAD'
            );
            expect(res.statusCode).toEqual(404);
        });

        it('should return 404 if no patient is found by mrn and location', async () => {
            const res = await request.get(
                '/patients/search?mrn=BAD&location=BAD'
            );
            expect(res.statusCode).toEqual(404);
        });

        it('should return 200 if a patient is found', async () => {
            const paths = [
                '/patients/search?givenName=Priscilla&familyName=Kelly&birthDate=1974-03-11',
                '/patients/search?mrn=73909&location=Joan Health System',
            ];
            for (const path of paths) {
                const res = await request.get(path);
                expect(res.statusCode).toEqual(200);
            }
        });
    });

    describe('GET /patients/search-by-practitioner', () => {
        it('should return 400 if no query params are provided', async () => {
            const res = await request
                .get('/patients/search-by-practitioner')
                .send();
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 if invalid query params are provided', async () => {
            const res = await request.get(
                '/patients/search-by-practitioner?badParam=BAD'
            );
            expect(res.statusCode).toEqual(400);
        });

        it('should return 400 if partial query params are provided', async () => {
            const paths = [
                '/patients/search-by-practitioner?givenName=BAD',
                '/patients/search-by-practitioner?familyName=BAD',
                '/patients/search-by-practitioner?npi=BAD',
                '/patients/search-by-practitioner?location=BAD',
            ];

            for (const path of paths) {
                const res = await request.get(path);
                expect(res.statusCode).toEqual(400);
            }
        });

        it('should return 200 with empty array if no patient is found by practitioner name', async () => {
            const res = await request.get(
                '/patients/search-by-practitioner?givenName=BAD&familyName=BAD'
            );
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('should 200 with empty array if no patient is found by location and practitioner npi', async () => {
            const res = await request.get(
                '/patients/search-by-practitioner?npi=BAD&location=BAD'
            );
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual([]);
        });

        it('should return 200 with populated array if patients are found', async () => {
            const paths = [
                '/patients/search-by-practitioner?givenName=Donald&familyName=Paiz',
                '/patients/search-by-practitioner?npi=22954&location=Joan Health System',
            ];
            for (const path of paths) {
                const res = await request.get(path);
                expect(res.statusCode).toEqual(200);
                expect(res.body.length).toBeGreaterThan(0);
            }
        });
    });
});
