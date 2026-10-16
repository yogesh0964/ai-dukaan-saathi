# AI Dukaan Saathi

AI Dukaan Saathi is a shop-management application intended to help small businesses manage products, inventory, customers, billing, and reports.

> **Security note:** This README documents the project setup and recommended safeguards. It does not certify that the application is production-ready. Verify the actual configuration and test the application before deploying it.

## Technology stack

Based on the project files provided:
- **Frontend:** React, Vite, React Router
- **Backend:** Java 21, Spring Boot, Spring Security, JWT
- **Database:** MongoDB

## Project structure

The project is split into frontend and backend applications. Keep their configuration separate and never commit credentials or production secrets.

## Before running the project

Install the required tools:
- Java 21
- Node.js and npm
- MongoDB, either local or a trusted hosted instance
- Maven, or use the project's Maven Wrapper if included

Check the frontend and backend folders for their own package/build files and configuration instructions. Use the commands below from the relevant folder.

### Frontend

```bash
npm install
npm run dev
```

Use `npm run` to see the scripts available in `package.json`. Do not run dependency installation from an untrusted source.

### Backend

If a Maven Wrapper is present:

**Windows**
```powershell
.\mvnw.cmd spring-boot:run
```

**macOS/Linux**
```bash
./mvnw spring-boot:run
```

Otherwise, with Maven installed:

```bash
mvn spring-boot:run
```

The backend requires valid MongoDB configuration and a secure JWT signing secret. Refer to the project's Spring configuration files to identify the exact environment-variable names and required settings.

## Security checklist

### 1. Secrets and environment variables
- Never hard-code JWT signing keys, database passwords, API keys, or tokens in source code.
- Read secrets from environment variables or a managed secret store.
- Set a long, randomly generated JWT secret before starting the backend. Do not use example values in production.
- If a real secret was ever committed to Git or shared, rotate it. Removing it from the latest file alone does not remove it from Git history.

Example for the current PowerShell session (replace the placeholder with a securely generated value):

```powershell
$env:APP_JWT_SECRET = "<set-a-long-random-secret-here>"
```

This variable name is only an example unless the backend configuration explicitly uses `APP_JWT_SECRET`. Confirm the exact property name in the source before relying on it.

### 2. Database access
- Use a dedicated MongoDB database user with only the permissions the application needs.
- Do not expose MongoDB directly to the public internet.
- Use a strong password and TLS for hosted database connections.
- Keep database connection strings out of Git and logs.
- Back up data and test restoring a backup.

### 3. Authentication and authorization
- Confirm that every protected API validates the JWT and checks the user's role/ownership.
- Do not rely on hiding frontend buttons as access control.
- Review registration and account-creation endpoints. Prevent unauthorized privilege assignment and abuse.
- Use short-lived access tokens where practical, validate token expiry and signing algorithm, and plan token revocation/rotation.
- Avoid storing long-lived sensitive tokens in browser local storage when a safer architecture is feasible.

### 4. CORS, inputs, and errors
- Configure CORS for only the frontend origins that actually need access. Avoid permissive wildcard settings in production when credentials are involved.
- Validate request data on the backend, including price, quantity, IDs, and user-supplied text.
- Return generic error messages to clients; do not expose stack traces, secrets, or database details.
- Apply rate limits to login, registration, and other abuse-prone endpoints.

### 5. Frontend and dependency hygiene
- Keep `.env` files containing secrets out of version control. Frontend variables bundled by Vite are public to users, so never put server secrets in `VITE_*` variables.
- Keep dependencies updated and review security advisories.
- Do not commit `node_modules`, build output, logs, local databases, or IDE-specific files unless there is a clear reason.
- Add an appropriate `.gitignore` and verify it before pushing.

### 6. Production deployment
- Use HTTPS.
- Disable development/debug settings and verbose error output.
- Restrict management endpoints and database access.
- Store secrets in the hosting platform's secret manager.
- Test authentication, authorization, validation, CORS, and backup restoration before release.

## Pre-deployment checks

- [ ] Frontend and backend start successfully.
- [ ] MongoDB connection works with a least-privilege account.
- [ ] No secrets are committed or included in frontend bundles.
- [ ] JWT signature, expiry, and authorization checks are tested.
- [ ] CORS permits only intended origins.
- [ ] Inputs are validated on the server.
- [ ] Dependencies are reviewed and updated.
- [ ] HTTPS and production environment settings are enabled.
- [ ] Backups and restore procedure are tested.

## Troubleshooting

- **Frontend scripts:** run `npm run` in the frontend folder to list available scripts.
- **Backend build:** confirm Java 21 is selected and use the included Maven Wrapper if present.
- **MongoDB connection:** verify the URI, network access, database user permissions, and environment configuration.
- **JWT errors:** verify the configured secret/property name, secret value, token expiry, and that all application instances use the same intended signing configuration.

## License

Add the project's actual license here before publishing or distributing it.
