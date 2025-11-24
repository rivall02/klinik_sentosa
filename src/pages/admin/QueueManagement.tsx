import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const getStatusVariant = (status: string) => {
  switch (status) {
    case "menunggu":
      return "secondary";
    case "sedang_konsultasi":
      return "default";
    case "selesai":
      return "outline";
    case "batal":
      return "destructive";
    default:
      return "secondary";
  }
};

const QueueManagement = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchAppointments = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("appointments")
          .select("*, patients(full_name), profiles(full_name)")
          .neq('status', 'batal') // Filter out cancelled appointments
          .order("appointment_time", { ascending: true });

        if (error) throw error;
        setAppointments(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [refreshKey]);

  const handleUpdateStatus = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: newStatus })
        .eq('id', appointmentId);
      
      if (error) throw error;

      toast({ title: "Status Antrian Diperbarui" });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Memperbarui", description: error.message });
    }
  };

  if (loading) return <div>Memuat data antrian...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manajemen Antrian Harian</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Waktu</TableHead>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Dokter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {appointments.map((appt) => (
            <TableRow key={appt.id}>
              <TableCell>{new Date(appt.appointment_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</TableCell>
              <TableCell>{appt.patients?.full_name || 'N/A'}</TableCell>
              <TableCell>{appt.profiles?.full_name || 'N/A'}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(appt.status)}>
                  {appt.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleUpdateStatus(appt.id, 'menunggu')}>Set "Menunggu"</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(appt.id, 'sedang_konsultasi')}>Set "Sedang Konsultasi"</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(appt.id, 'selesai')}>Set "Selesai"</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => handleUpdateStatus(appt.id, 'batal')}>Set "Batal"</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QueueManagement;

