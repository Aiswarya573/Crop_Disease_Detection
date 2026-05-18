/*
  # Create Predictions History Table

  1. New Tables
    - `predictions`
      - `id` (uuid, primary key)
      - `image_url` (text) - base64 or URL of analyzed image
      - `disease_name` (text) - detected disease name
      - `confidence` (numeric) - confidence percentage 0-100
      - `description` (text) - disease description
      - `causes` (text[]) - array of causes
      - `prevention` (text[]) - array of prevention methods
      - `treatment` (text) - recommended treatment
      - `crop_type` (text) - type of crop detected
      - `is_healthy` (boolean) - whether leaf is healthy
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS
    - Allow anyone to insert and read (public app, no auth)
*/

CREATE TABLE IF NOT EXISTS predictions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  image_url text NOT NULL DEFAULT '',
  disease_name text NOT NULL DEFAULT '',
  confidence numeric NOT NULL DEFAULT 0,
  description text NOT NULL DEFAULT '',
  causes text[] NOT NULL DEFAULT '{}',
  prevention text[] NOT NULL DEFAULT '{}',
  treatment text NOT NULL DEFAULT '',
  crop_type text NOT NULL DEFAULT '',
  is_healthy boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE predictions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read predictions"
  ON predictions FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can insert predictions"
  ON predictions FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can delete predictions"
  ON predictions FOR DELETE
  TO anon, authenticated
  USING (true);
