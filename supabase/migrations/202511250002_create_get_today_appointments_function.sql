-- supabase/migrations/202511250002_create_get_today_appointments_function.sql

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
        -- Filter appointments for the current day based on the database's timezone
        a.appointment_time >= date_trunc('day', now()) AND
        a.appointment_time < date_trunc('day', now()) + interval '1 day'
    ORDER BY
        a.queue_number;
END;
$$ LANGUAGE plpgsql;
