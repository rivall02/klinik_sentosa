import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, getDay } from 'date-fns';

type Appointment = {
  time: string;
  patient: string;
};

const Schedule = () => {
  const [unscheduledPatients, setUnscheduledPatients] = useState<any[]>([]);
  const [scheduledAppointments, setScheduledAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [patientToSchedule, setPatientToSchedule] = useState<any | null>(null);
  const [scheduleDate, setScheduleDate] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const { toast } = useToast();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        // 1. Fetch verified patients
        const { data: patientsData, error: patientsError } = await supabase
          .from('patients')
          .select('*')
          .eq('is_pending_verification', false);
        if (patientsError) throw patientsError;

        // 2. Fetch this doctor's appointments for the current week
        const today = new Date();
        const weekStart = startOfWeek(today, { weekStartsOn: 1 }); // Monday
        const weekEnd = endOfWeek(today, { weekStartsOn: 1 });

        const { data: appointmentsData, error: appointmentsError } = await supabase
          .from('appointments')
          .select('*, patients(full_name)')
          .eq('doctor_id', user.id)
          .gte('appointment_time', weekStart.toISOString())
          .lte('appointment_time', weekEnd.toISOString());
        if (appointmentsError) throw appointmentsError;
        
        // Filter out patients who already have an appointment
        const scheduledPatientIds = new Set(appointmentsData.map(appt => appt.patient_id));
        const filteredUnscheduled = patientsData.filter(p => !scheduledPatientIds.has(p.id));

        setUnscheduledPatients(filteredUnscheduled);
        setScheduledAppointments(appointmentsData);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [refreshKey]);
  
  const handleOpenScheduleDialog = (patient: any) => {
    setPatientToSchedule(patient);
    setIsScheduleDialogOpen(true);
  };
  
  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientToSchedule || !scheduleDate || !scheduleTime) {
      toast({ variant: "destructive", title: "Data tidak lengkap", description: "Mohon isi tanggal dan waktu."});
      return;
    }

    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("User not found");

        const appointmentDateTime = new Date(`${scheduleDate}T${scheduleTime}`);

        const { error } = await supabase.from('appointments').insert({
            patient_id: patientToSchedule.id,
            doctor_id: user.id,
            appointment_time: appointmentDateTime.toISOString(),
            status: 'menunggu',
            queue_number: Math.floor(Math.random() * 100) + 1, // Placeholder
        });

        if (error) throw error;

        toast({ title: "Sukses!", description: `Jadwal untuk ${patientToSchedule.full_name} telah dibuat.` });
        setIsScheduleDialogOpen(false);
        setRefreshKey(prev => prev + 1); // Refresh data
    } catch(error: any) {
        toast({ variant: "destructive", title: "Gagal Membuat Jadwal", description: error.message });
    }
  };

  const getWeeklySchedule = () => {
    const weekDays = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const schedule: { [key: string]: Appointment[] } = { Senin:[], Selasa:[], Rabu:[], Kamis:[], Jumat:[] };
    
    scheduledAppointments.forEach(appt => {
      const apptDate = new Date(appt.appointment_time);
      const dayName = weekDays[getDay(apptDate)];
      if (dayName in schedule) {
        schedule[dayName].push({
          time: format(apptDate, 'HH:mm'),
          patient: appt.patients.full_name,
        });
      }
    });
    return schedule;
  };

  if (loading) return <div>Memuat data jadwal...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manajemen Jadwal Pasien</h2>

      <Card>
        <CardHeader><CardTitle>Pasien Belum Terjadwal</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Nama Pasien</TableHead><TableHead>Waktu Luang</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
            <TableBody>
              {unscheduledPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.full_name}</TableCell>
                  <TableCell>
                    {patient.availability ? (
                      <ul className="text-sm">
                        {Object.entries(patient.availability).map(([day, time]) => (
                          <li key={day}><span className="font-semibold capitalize">{day}:</span> {`${time || 'Tidak tersedia'}`}</li>
                        ))}
                      </ul>
                    ) : <span className="text-muted-foreground">Tidak ada data</span>}
                  </TableCell>
                  <TableCell><Button onClick={() => handleOpenScheduleDialog(patient)}>Jadwalkan</Button></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Jadwal Konsultasi Minggu Ini</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(getWeeklySchedule()).map(([day, appointments]) => (
            <div key={day}>
              <h3 className="font-semibold mb-2">{day}</h3>
              <div className="space-y-2">
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <Card key={index} className="p-2 bg-muted"><p className="text-sm font-medium">{appt.patient}</p><p className="text-xs text-muted-foreground">{appt.time}</p></Card>
                  ))
                ) : <p className="text-sm text-muted-foreground">Tidak ada jadwal</p>}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Jadwalkan {patientToSchedule?.full_name}</DialogTitle></DialogHeader>
          <form onSubmit={handleCreateAppointment} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input id="date" type="date" value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} required/>
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Waktu</Label>
              <Input id="time" type="time" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} required/>
            </div>
            <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                <Button type="submit">Simpan Jadwal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Schedule;

