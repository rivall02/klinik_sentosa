-- supabase/migrations/202511250001_create_settings_table.sql

-- Create the settings table
CREATE TABLE IF NOT EXISTS public.settings (
    id BIGINT PRIMARY KEY DEFAULT 1,
    clinic_name TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    operating_hours JSONB,
    consultation_fees JSONB,
    CONSTRAINT single_row_constraint CHECK (id = 1)
);

-- Enable Row Level Security
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Create policies for settings table
-- Allow public read access
CREATE POLICY "Allow public read access on settings"
ON public.settings
FOR SELECT
USING (true);

-- Allow admin write access
CREATE POLICY "Allow admin write access on settings"
ON public.settings
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');


-- Insert initial default data
-- This will only run once if the table is empty.
-- The ON CONFLICT clause prevents errors if the row with id=1 already exists.
INSERT INTO public.settings (id, clinic_name, address, phone, email, operating_hours, consultation_fees)
VALUES (
    1,
    'Klinik Sentosa',
    'Jl. Sehat No. 123, Jakarta',
    '+62 21 1234 5678',
    'kontak@kliniksentosa.com',
    '[
        {"day": "Senin", "open": "08:00", "close": "20:00", "is_closed": false},
        {"day": "Selasa", "open": "08:00", "close": "20:00", "is_closed": false},
        {"day": "Rabu", "open": "08:00", "close": "20:00", "is_closed": false},
        {"day": "Kamis", "open": "08:00", "close": "20:00", "is_closed": false},
        {"day": "Jumat", "open": "08:00", "close": "20:00", "is_closed": false},
        {"day": "Sabtu", "open": "09:00", "close": "15:00", "is_closed": false},
        {"day": "Minggu", "open": "00:00", "close": "00:00", "is_closed": true}
    ]',
    '[
        {"name": "Poli Umum", "fee": 150000},
        {"name": "Poli Gigi", "fee": 200000},
        {"name": "Poli Anak", "fee": 175000}
    ]'
)
ON CONFLICT (id) DO NOTHING;
