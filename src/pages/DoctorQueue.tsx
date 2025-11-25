import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { startOfToday, endOfToday } from 'date-fns';

const getStatusVariant = (status: string) => {
  switch (status) {
    case "menunggu": return "secondary";
    case "sedang_konsultasi": return "default";
    default: return "secondary";
  }
};

const DoctorQueue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTodaysQueue = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        const todayStart = startOfToday().toISOString();
        const todayEnd = endOfToday().toISOString();

        const { data, error } = await supabase
          .from('appointments')
          .select('*, patients(full_name)')
          .eq('doctor_id', user.id)
          .gte('appointment_time', todayStart)
          .lte('appointment_time', todayEnd)
          .neq('status', 'batal')
          .neq('status', 'selesai')
          .order('appointment_time', { ascending: true });

        if (error) throw error;
        setAppointments(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTodaysQueue();
  }, []);

  const handleStartConsultation = async (appointment: any) => {
    try {
      // Update status to 'in consultation'
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'sedang_konsultasi' })
        .eq('id', appointment.id);

      if (error) throw error;
      
      toast({
        title: "Pasien Dipanggil",
        description: `Memulai sesi konsultasi untuk ${appointment.patients.full_name}.`,
      });

      // Navigate to consultation room
      navigate(`/doctor/consultation/${appointment.patient_id}/${appointment.id}`);

    } catch (err: any) {
       toast({
        variant: "destructive",
        title: "Gagal Memanggil Pasien",
        description: err.message,
      });
    }
  };

  if (loading) return <div>Memuat antrian hari ini...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/doctor")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Antrian Pasien Hari Ini
          </h2>
          <div className="space-y-3">
            {appointments.length > 0 ? appointments.map((appt) => (
              <div
                key={appt.id}
                className="p-4 rounded-lg border bg-card border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-foreground">
                      {appt.patients.full_name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Jadwal: {new Date(appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <Badge variant={getStatusVariant(appt.status)}>
                    {appt.status}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleStartConsultation(appt)}
                    className="flex-1"
                    disabled={appt.status === 'sedang_konsultasi'}
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    {appt.status === 'sedang_konsultasi' ? 'Dalam Sesi' : 'Panggil & Mulai Konsultasi'}
                  </Button>
                </div>
              </div>
            )) : <p className="text-center text-muted-foreground py-4">Tidak ada antrian untuk hari ini.</p>}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorQueue;
