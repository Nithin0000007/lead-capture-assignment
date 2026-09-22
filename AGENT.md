# Agent Notes

This repository is a full-stack lead capture app with separate frontend and backend workspaces.

## Workspaces

- Frontend lives in `client/`.
- Backend lives in `server/`.
- Run commands from the workspace they belong to. Do not run client scripts from the repo root.

## Common Commands

Frontend:

```bash
cd client
npm run typecheck
npm run lint
npm run build
```

Backend:

```bash
cd server
npm run build
```

## Environment

Backend `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lead-capture
CLIENT_URL=http://localhost:5173
```

Frontend `client/.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

`VITE_API_URL` defaults to `http://localhost:5000/api` in the frontend API layer if it is not set.

## Architecture

- Backend API is mounted under `/api`.
- Lead routes are mounted under `/api/leads`.
- Frontend API calls should stay in `client/src/api/leads.ts`.
- Lead state and pagination state live in `client/src/hooks/useLeads.ts`.
- Shared frontend lead types live in `client/src/types/lead.ts`.
- Mongo lead validation lives in `server/src/models/Lead.ts`.

## Current Lead Features

- Create and edit leads.
- Search by name, email, or phone.
- Paginate with page sizes `5`, `10`, `25`, `50`, and `100`.
- Inline status updates.
- CSV import through a mapping modal before bulk creation.

## API Response Conventions

Successful non-paginated responses:

```json
{ "data": {} }
```

Successful paginated list responses:

```json
{
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 0,
    "totalPages": 0,
    "hasPreviousPage": false,
    "hasNextPage": false
  }
}
```

Errors:

```json
{ "error": "Message" }
```

## Implementation Notes

- Do not reintroduce Supabase. The frontend talks to the Express backend.
- Keep CSV parsing dependency-free unless there is a clear reason to add a package.
- Preserve the existing drawer/modal/toast patterns for user flows.
- Use Tailwind classes for UI styling.
- Keep backend validation even when frontend validation already exists.
- Avoid broad refactors while changing feature behavior.

## Known Lint Notes

`npm run lint` in `client/` currently reports Fast Refresh warnings for files that export helpers/constants alongside components. These are warnings, not errors.
