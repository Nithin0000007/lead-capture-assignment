# Lead Capture System

A full-stack Lead Management application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS** on the frontend, and **Node.js**, **Express**, **TypeScript**, and **MongoDB (Mongoose)** on the backend.

---

## Project Structure

```text
lead-capture-assignment/
├── client/                 # Frontend Workspace (React, Vite, Tailwind CSS)
│   ├── src/
│   │   ├── api/            # API integration layer
│   │   ├── components/     # UI components (LeadList, Table, Drawer, Toast, etc.)
│   │   ├── hooks/          # Custom React hooks (useLeads)
│   │   ├── lib/            # Utilities & Supabase/API config
│   │   └── types/          # TypeScript definitions
│   └── package.json
├── server/                 # Backend Workspace (Node.js, Express, MongoDB) [To be set up / expanded]
└── GEMINI.md               # Project architecture and development guidelines
```

---

## Tech Stack

- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend:** Node.js, Express, TypeScript, Mongoose
- **Database:** MongoDB

---

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB instance (local or MongoDB Atlas URI)

### 1. Backend Setup (`server/`)

*(If applicable in your workspace)*
```bash
cd server
npm install
```
Create a `.env` file in `server/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
```
Run the development server:
```bash
npm run dev
```

### 2. Frontend Setup (`client/`)

```bash
cd client
npm install
```
Create a `.env` file in `client/` if needed:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the Vite dev server:
```bash
npm run dev
```

---

## Core Features

- **Lead Management:** View, create, update, and delete leads.
- **Search & Filter:** Instant search across lead name, email, and phone with debouncing.
- **Status Tracking:** Track lead progress across statuses (`New`, `Contacted`, `Qualified`, `Converted`, `Lost`).
- **Responsive UI:** Modern, accessible interface styled with Tailwind CSS.
