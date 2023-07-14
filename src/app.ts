import express from 'express';
import { patientRouter } from './routers/patient-router';

const app = express();

app.use(express.json());
app.use('/patients', patientRouter);

export default app;
