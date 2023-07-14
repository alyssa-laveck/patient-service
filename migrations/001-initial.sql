CREATE TABLE practitioners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    given_name TEXT NOT NULL,
    family_name TEXT NOT NULL,
    npi INTEGER NOT NULL
);

CREATE TABLE patients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    given_name TEXT NOT NULL,
    family_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    appointment DATE NOT NULL,
    mrn INTEGER NOT NULL,
    location TEXT NOT NULL,
    general_practitioner_id INTEGER NOT NULL,
    FOREIGN KEY (general_practitioner_id) REFERENCES practitioners (id)
);