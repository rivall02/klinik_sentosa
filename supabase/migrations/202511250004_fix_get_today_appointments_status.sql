-- supabase/migrations/202511250004_fix_get_today_appointments_status.sql

CREATE OR REPLACE FUNCTION get_today_appointments()
RETURNS TABLE (
    queue_number INT,
    status TEXT,
    patient_name TEXT
) 
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT
        a.queue_number,
        a.status,
        p.full_name AS patient_name
    FROM
        public.appointments AS a
    LEFT JOIN
        public.patients AS p ON a.patient_id = p.id
    WHERE
        -- Filter for appointments for the current day
        a.appointment_time >= date_trunc('day', now()) AND
        a.appointment_time < date_trunc('day', now()) + interval '1 day' AND
        -- ONLY get patients that are actively in the queue
        a.status IN ('menunggu', 'sedang_konsultasi')
    ORDER BY
        a.queue_number;
END;
$$ LANGUAGE plpgsql;
