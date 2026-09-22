# Lead Capture System

A full-stack lead management application built with React, TypeScript, Vite, Tailwind CSS, Node.js, Express, TypeScript, and MongoDB via Mongoose.

## Project Structure

```text
lead-capture-assignment-main/
|-- client/                  # React + Vite frontend
|-- server/                  # Express + MongoDB backend
|   |-- src/
|   |   |-- __tests__/       # Integration tests
|   |   |-- config/          # Database connection
|   |   |-- controllers/     # Request handlers
|   |   |-- middleware/      # Express middleware
|   |   |-- models/          # Mongoose models (Lead, Activity)
|   |   |-- routes/          # API routes
|   |   `-- services/        # Business logic services
|   `-- package.json
|-- AGENT.md                 # Agent/developer working notes
|-- GEMINI.md                # Additional project instructions
|-- docker-compose.yml       # Docker orchestration
`-- README.md
```

## Features

- **Lead Tracking:** Create, edit, search, and paginate leads.
- **Webhook Integration:** `POST /api/webhook/meta-lead` for automated lead ingestion, with deduplication, normalization (E.164 phone, Title Case name), and robust error handling.
- **Audit Trail:** Every change (`Created`, `Updated`, `StatusChanged`) is tracked in an `Activity` collection with granular field-level change history.
- **Responsive UI:** Modern, responsive design with an integrated `ActivityTimeline` in the lead drawer.
- **DevOps:** Fully Dockerized setup with `docker-compose.yml`.

## API Overview

Base URL: `http://localhost:5000/api`

### New Webhook Endpoint
```http
POST /webhook/meta-lead
```

### New Activities Endpoint
```http
GET /activities/:leadId
```

## Docker Usage

```bash
docker-compose up --build
```

Runs the `client` (port 3000), `server` (port 5000), and `mongodb`.

## Tech Stack

- Frontend: React 18, TypeScript, Vite, Tailwind CSS, lucide-react
- Backend: Node.js, Express, TypeScript
- Database: MongoDB with Mongoose

## Features

- Create and edit leads.
- Search leads by name, email, or phone.
- Paginated lead list with page sizes of 5, 10, 25, 50, and 100.
- Inline lead status updates.
- CSV import with a field-mapping modal before bulk creation.
- Backend validation for single and bulk lead creation.
- Responsive table/card layouts for desktop and mobile.

## Getting Started

### Prerequisites

- Node.js 18+
- A local MongoDB instance or MongoDB Atlas connection string

### Backend

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lead-capture
CLIENT_URL=http://localhost:5173
```

Run the backend:

```bash
npm run dev
```

Build the backend:

```bash
npm run build
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env` if you need to override the default API URL:

```env
VITE_API_URL=http://localhost:5000/api
```

Run the frontend:

```bash
npm run dev
```

Useful frontend checks:

```bash
npm run typecheck
npm run lint
npm run build
```

## API Overview

Base URL: `http://localhost:5000/api`

### Webhook
```http
POST /webhook/meta-lead
```

### Leads
```http
GET /leads?page=1&limit=5&search=jane
POST /leads
POST /leads/import
GET /leads/:id
PATCH /leads/:id
DELETE /leads/:id
```

### Activities
```http
GET /activities/:leadId
```


`GET /leads` returns paginated data:

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

Allowed `limit` values are `5`, `10`, `25`, `50`, and `100`. Invalid or missing limits fall back to `5`.

### Lead Shape

```ts
{
  _id: string;
  name: string;
  email: string;
  phone: string;
  status: 'New' | 'Contacted' | 'Qualified' | 'Converted' | 'Lost';
  createdAt: string;
}
```

### CSV Import

The frontend parses a selected CSV file, shows a field-mapping modal, validates mapped rows, and sends normalized leads to:

```http
POST /api/leads/import
```

Request body:

```json
{
  "leads": [
    {
      "name": "Jane Harris",
      "email": "jane@example.com",
      "phone": "5554288013",
      "status": "New"
    }
  ]
}
```

Response body:

```json
{
  "data": {
    "created": [],
    "summary": {
      "received": 1,
      "created": 1,
      "failed": 0
    },
    "errors": []
  }
}
```

Required mapped fields are `Name`, `Email`, and `Phone`. `Status` is optional and defaults to `New`.

## Notes

- The frontend no longer uses Supabase. All lead data flows through the Express API.
- Keep `client/` and `server/` dependencies installed separately.
- The backend uses `MONGO_URI`, not `MONGODB_URI`.
