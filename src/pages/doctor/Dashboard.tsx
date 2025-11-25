import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabaseClient";
import { startOfToday, endOfToday } from 'date-fns';
import { Users, CheckCircle, Clock, ArrowRight } from "lucide-react";

const DoctorDashboardHome = () => {
  const navigate = useNavigate();
  const [summaryData, setSummaryData] = useState({
    patientsWaiting: 0,
    consultationsDone: 0,
    nextPatients: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [doctorName, setDoctorName] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found.");

        // Fetch doctor's name
        const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
        if(profile) setDoctorName(profile.full_name);

        const todayStart = startOfToday().toISOString();
        const todayEnd = endOfToday().toISOString();

        const { data, error: apptError } = await supabase
          .from('appointments')
          .select('status, patients(full_name)')
          .eq('doctor_id', user.id)
          .gte('appointment_time', todayStart)
          .lte('appointment_time', todayEnd)
          .neq('status', 'batal');
        
        if (apptError) throw apptError;

        const patientsWaiting = data.filter(a => a.status === 'menunggu').length;
        const consultationsDone = data.filter(a => a.status === 'selesai').length;
        const nextPatients = data
          .filter(a => a.status === 'menunggu')
          .slice(0, 3)
          .map((a: any) => a.patients.full_name);

        setSummaryData({ patientsWaiting, consultationsDone, nextPatients: nextPatients as any });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) return <div>Memuat data dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Selamat Datang, {doctorName || 'Dokter'}!</h2>
        <p className="text-muted-foreground">Berikut adalah ringkasan aktivitas Anda hari ini.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasien Menunggu</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.patientsWaiting}</div>
            <p className="text-xs text-muted-foreground">pasien dalam antrian</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Konsultasi Selesai</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summaryData.consultationsDone}</div>
            <p className="text-xs text-muted-foreground">pasien telah ditangani hari ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Next Patients & Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Antrian Berikutnya</CardTitle>
          </CardHeader>
          <CardContent>
            {summaryData.nextPatients.length > 0 ? (
              <ul className="space-y-2">
                {summaryData.nextPatients.map((name, index) => (
                   <li key={index} className="flex items-center">
                     <Clock className="h-4 w-4 mr-2 text-muted-foreground"/> 
                     <span>{name}</span>
                   </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">Tidak ada pasien dalam antrian.</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="flex flex-col justify-center">
          <CardHeader>
            <CardTitle>Akses Cepat</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => navigate('/doctor/queue')} className="w-full justify-between">
              <span>Lihat Semua Antrian</span>
              <ArrowRight className="h-4 w-4"/>
            </Button>
            <Button onClick={() => navigate('/doctor/schedule')} variant="outline" className="w-full justify-between">
              <span>Manajemen Jadwal</span>
              <ArrowRight className="h-4 w-4"/>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorDashboardHome;

