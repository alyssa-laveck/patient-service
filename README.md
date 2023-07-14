## Setup

_"Setup instructions for Part 1"_

1. run `npm i` to install dependencies
2. run `npm run seed_db` to seed the database with data from `seeds/input.json`

## Development

_"Instructions on how to run your code in Part 2"_

### Running the API

1. run `npm i` to install dependencies (if not already done)
2. run `npm run start` to start the server

### Running the Tests

1. run `npm i` to install dependencies (if not already done)
2. run `npm run test` to run the tests

## Technical Decisions

_"The reasons for your technical decisions in designing Part 1 and Part 2"_

### Part 1

Initially, I considered setting up an upload endpoint to accept the JSON file and populate the database. But after some thought, I realized that a seed script might be a more fitting solution. It's hard to imagine a real-world scenario where an API would require a full database refresh from a JSON file. On top of that, a seed script is more straightforward to implement and test, making it a more efficient choice in this case since it's only used for development.

I opted to utilize TypeScript for the seed script in order to maintain consistency across the codebase. This approach ensures that in a real-word situation where a team was working on the project, anyone contributing to the API can effortlessly modify the seed script as needed. For the database, I selected SQLite due to its lightweight nature, ease of setup, and my personal familiarity with it.

### Part 2

#### Tech Stack

Given the choice between TypeScript and JavaScript, I selected TypeScript. With over six years of extensive experience under my belt, I appreciate the robustness and reliability that TypeScript's type system brings, especially when dealing with large codebases. Not to mention, it offers a superior developer experience, providing useful type information in the IDE and detecting errors at compile time.

For the API framework, I opted for Express.js. It's a widely adopted framework that I'm familiar with, and it stands out with its simplicity and speed of setup. You can get a basic Express.js API up and running in mere minutes, making it an excellent choice for this project.

For testing, I gravitated towards Jest, a framework I've consistently used in my professional work. Its wide popularity among the JS/TS community means other developers are likely to be familiar with it, enhancing the readability and maintainability of the code. Although Jest started off with a strong emphasis on component testing, its abilities have broadened to include API testing as well. For this project, I made use of the `supertest` library in conjunction with Jest to exemplify its adaptability to varied testing scenarios. This choice not only demonstrates Jest's capabilities but also reflects my comprehensive understanding of it.

#### API Design

In designing the API, I committed to the principles of REST. I established a dedicated router file for the patients resource and maintained consistency with RESTful API best practices, such as utilizing plural nouns for endpoints and returning the relevant HTTP status codes. In specific scenarios, a `400` is returned for invalid requests, `404` for resources not found, `500` for server errors, and `200` for successful requests.

I opted for query parameters for the `GET` endpoints, given that it's uncommon for these requests to include a body. With the implementation of the repository pattern, I was able to keep the data layer separate from the business logic. At the same time, the singleton pattern was used to maintain a single instance of the database connection across the API.

In order to leverage the asynchronous capabilities of Express.js, I crafted an `initializeApp()` function that ensures the database is connected before the API starts processing requests. I placed high importance on error handling to ensure the API's robustness and reliability.

In order to maximize the advantages of TypeScript's type system, I established dedicated contracts for the creation requests and the expected query parameters. This practice aids in maintaining a well-documented and self-explanatory codebase. Moreover, I kept separate contracts/models for the database entities and the API requests, ensuring that the API is decoupled from the database and allowing the data layer to be easily replaced if needed. I unfortunately ran out of time to implement the response DTOs, but I would have done so if I had more time.

#### Database Design

When it comes to the database logic, I chose to employ migrations to easily apply and rollback future changes. To keep the implementation uncluttered, I leaned towards raw SQL. Nonetheless, safety from SQL injection attacks was ensured by thoroughly sanitizing input through parameterized queries.

The schema was primarily based on the JSON structure provided in the project instructions, with the only amendment being the addition of an `id` field. I opted for the `INTEGER` type for the `id` field and enabled `AUTOINCREMENT` to offload the indexing to the database. This decision was grounded on the premise that the `id` field would act as a unique identifier for patient and practitioner records. Although a UUID would have been ideal, its lack of native support in SQLite led to this alternative.

I identified two distinct resources, namely `practitioners` and `patients`, and consequently created tables for each. Given my assumption that each patient has only one general practitioner while a practitioner can cater to multiple patients, I established a one-to-many relationship from `practitioner` to `patient`. This setup echoes the real-world dynamics in the healthcare system.

## Notes

_"Relevant notes about your solution. If there is any ambiguity, make a note of your assumptions."_

### Chosen Queries

**Query 1**

-   > Query using the patient's given name, family name, and birth date (OR their MRN and associated hospital location) to return their patient record.

**Query 2**

-   > Query using the practitioner's given name and family name (OR their NPI and associated hospital location) to return all patients that list the practitioner as their general practitioner.

### Assumptions

-   This project is not intended to be production-ready
-   Anyone making use of this project will already have SQLite installed or will be able to install it themselves
-   Patients have one general practitioner
-   Practitioners can have multiple patients
-   Both queries require the full parameters to be present in order to be valid - see unit tests for examples
    -   Query 1 requires either the patient's given name, family name, and birth date OR their MRN and hospital location to be present for the query to be valid
        -   e.g. If the user provides the patient's given name and family name, but not their birth date, the query will be invalid and return a `400` error.
    -   Query 2 requires either the practitioner's given name and family name OR their NPI and hospital location to be present for the query to be valid
        -   e.g. If the user provides the practitioner's NPI but not their hospital location, the query will be invalid and return a `400` error.
-   Query 1 returns a single patient record
-   Query 2 returns multiple patient records and an empty array if no patients are found
-   Query 2 uses the `patient`'s `location` since the `practitioner`'s `location` is not provided in the JSON file

### Improvements

If I had more time or this project was intended to be production-ready, I would have implemented the following:

-   Enhanced Code Documentation
    -   With more time, I would have enriched the project with more detailed JSdoc documentation for functions and interfaces, along with Swagger for API documentation.
-   Comprehensive DTOs
    -   While I managed to implement DTOs for the request bodies, I would have extended them to the responses as well with more time at my disposal.
-   UUIDs for IDs
    -   To ensure database-wide uniqueness, I would have opted for UUIDs instead of integers for id fields, potentially transitioning away from SQLite due to its lack of native UUID support.
-   Refined Query Parameter Interfaces
    -   The current structures encompass all of the relevant query params per endpoint forcing all of them to be optional. In retrospect, a more elegant design would have involved separate interfaces for each query parameter set, which could then be combined for each endpoint. This would lead to better validation by enforcing more stringent requirements for query parameters.
-   ESLint/Prettier and Git Hooks
    -   I would have employed linting and formatting tools such as ESLint and Prettier to maintain code consistency and best practices, automated with Git hooks.
-   ORM Implementation
    -   Rather than raw SQL, utilizing an ORM would have offered the benefits of optimized queries and database agnosticism.
-   Pagination
    -   To accommodate large data sets and ensure scalability, I would have implemented pagination.
-   Dependency Injection
    -   A more modular and testable codebase could have been achieved with the introduction of dependency injection.
-   Logging
    -   For improved visibility and insights into API operations, I would have set up a logging system.
-   Authentication
    -   I would have implemented authentication using JWTs to ensure that only authorized users can access the API.
-   Containerization
    -   To ensure a user-friendly experience without necessitating SQLite installation on the user's part, I would have containerized the application.
-   Add Auditing Fields
    -   I would have added auditing fields like `created_at` and `updated_at` fields to the database tables to keep track of when records were created and updated.
-   Health Check Endpoint
    -   The implementation of a health check endpoint would have assured the API's operational status.
