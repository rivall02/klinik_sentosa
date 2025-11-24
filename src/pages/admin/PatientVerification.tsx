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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const PatientVerification = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const fetchPatients = async () => {
    setLoading(true);
    try {
      // Hanya ambil pasien yang statusnya masih pending verifikasi
      const { data, error } = await supabase
        .from("patients")
        .select("*")
        .eq('is_pending_verification', true)
        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }
      setPatients(data);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients();
  }, [refreshKey]);

  // Fungsi ini akan menghapus pasien dari daftar verifikasi dengan mengubah flag-nya
  const handleRemoveFromVerification = async (patientId: string, action: 'disetujui' | 'ditolak') => {
    try {
      const { error } = await supabase
        .from("patients")
        .update({ is_pending_verification: false })
        .eq("id", patientId);

      if (error) {
        throw error;
      }

      toast({
        title: "Verifikasi Selesai",
        description: `Pasien telah ${action} dan dihapus dari daftar ini.`,
      });
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Gagal Memperbarui Status",
        description: error.message,
      });
    }
  };

  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
    setIsDetailDialogOpen(true);
  };

  if (loading) {
    return <div>Memuat data pasien yang perlu verifikasi...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Verifikasi Pasien</h2>
      <p className="text-muted-foreground mb-4">Daftar ini hanya menampilkan pasien baru yang pendaftarannya perlu ditinjau.</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Tanggal Pendaftaran</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.length > 0 ? patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.full_name}</TableCell>
              <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(patient)}>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveFromVerification(patient.id, 'disetujui')}>Setujui (Hapus dari daftar)</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleRemoveFromVerification(patient.id, 'ditolak')}>Tolak (Hapus dari daftar)</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          )) : (
            <TableRow>
              <TableCell colSpan={3} className="text-center">Tidak ada pasien yang memerlukan verifikasi.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Detail Patient Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
            <DialogDescription>
              Informasi lengkap mengenai pasien ini.
            </DialogDescription>
          </DialogHeader>
          {selectedPatient && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Nama Lengkap</Label>
                <p className="col-span-3">{selectedPatient.full_name}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">No. Rekam Medis</Label>
                <p className="col-span-3">{selectedPatient.medical_record_number || "-"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Tanggal Lahir</Label>
                <p className="col-span-3">{selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : "-"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Telepon</Label>
                <p className="col-span-3">{selectedPatient.phone_number || "-"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Alamat</Label>
                <p className="col-span-3">{selectedPatient.address || "-"}</p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Terdaftar Sejak</Label>
                <p className="col-span-3">{new Date(selectedPatient.created_at).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientVerification;

