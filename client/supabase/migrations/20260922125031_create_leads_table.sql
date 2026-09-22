/*
# Create leads table (single-tenant, no auth)

1. New Tables
- `leads`
  - `id` (uuid, primary key, auto-generated)
  - `name` (text, not null) — lead's full name
  - `email` (text, not null) — lead's email address
  - `phone` (text, not null) — lead's phone number
  - `status` (text, not null, default 'New') — pipeline status: New | Contacted | Qualified | Converted | Lost
  - `created_at` (timestamptz, default now()) — when the lead was created

2. Security
- Enable RLS on `leads`.
- Allow anon + authenticated full CRUD because this is a single-tenant demo app with no sign-in.
- All data is intentionally shared/public.

3. Indexes
- Index on `created_at` (descending) for default sort (newest first).
- Index on `status` for filtering by pipeline stage.
*/

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  status text NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Qualified', 'Converted', 'Lost')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads (status);

ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_leads" ON leads;
CREATE POLICY "anon_select_leads" ON leads FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_leads" ON leads;
CREATE POLICY "anon_insert_leads" ON leads FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_leads" ON leads;
CREATE POLICY "anon_update_leads" ON leads FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_leads" ON leads;
CREATE POLICY "anon_delete_leads" ON leads FOR DELETE
  TO anon, authenticated USING (true);