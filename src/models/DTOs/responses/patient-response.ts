import { PractitionerResponse } from './practitioner-response';

export interface GetPatientByDetailsResponse {
    id: number;
    givenName: string;
    familyName: string;
    birthDate: string;
    appointment: string;
    mrn: number;
    location: string;
    generalPractitioner: PractitionerResponse;
}
