import { Server } from 'http';
import app from './app';
import { closeDb, openDb } from './database';

export let server: Server;
const port = 3000;

export async function initializeApp(): Promise<void> {
    // open connection to DB
    await openDb();

    // start express server
    server = app.listen(port, () => {
        console.log(`Patient service listening at http://localhost:${port}`);
    });
}

initializeApp().catch((error) => {
    closeDb();
    console.error(error);
    process.exit(1);
});
