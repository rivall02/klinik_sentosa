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
} from "@/components/ui/dialog"; // Import Dialog components
import { Label } from "@/components/ui/label"; // Import Label component
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const PatientVerification = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const [selectedPatient, setSelectedPatient] = useState<any | null>(null); // State for selected patient
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false); // State for dialog visibility

  const fetchPatients = async () => {
    try {
      const { data, error } = await supabase
        .from("patients")
        .select("*")
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

  const handleUpdateStatus = async (patientId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("patients")
        .update({ status: newStatus })
        .eq("id", patientId);

      if (error) {
        throw error;
      }

      toast({
        title: "Status Pasien Diperbarui",
        description: `Status pasien berhasil diubah menjadi ${newStatus}.`,
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
    return <div>Memuat data pasien...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Verifikasi Pasien</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Tanggal Pendaftaran</TableHead>
            <TableHead>Status Verifikasi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.full_name}</TableCell>
              <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
              <TableCell>{patient.status}</TableCell>
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
                    <DropdownMenuItem onClick={() => handleUpdateStatus(patient.id, 'verified')}>Setujui</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(patient.id, 'rejected')}>Tolak</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleUpdateStatus(patient.id, 'revision_requested')}>Minta Revisi</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
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
                <Label htmlFor="fullName" className="text-right">
                  Nama Lengkap
                </Label>
                <p id="fullName" className="col-span-3 text-left">
                  {selectedPatient.full_name}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="medicalRecordNumber" className="text-right">
                  No. Rekam Medis
                </Label>
                <p id="medicalRecordNumber" className="col-span-3 text-left">
                  {selectedPatient.medical_record_number || "-"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="dob" className="text-right">
                  Tanggal Lahir
                </Label>
                <p id="dob" className="col-span-3 text-left">
                  {selectedPatient.date_of_birth ? new Date(selectedPatient.date_of_birth).toLocaleDateString() : "-"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Telepon
                </Label>
                <p id="phone" className="col-span-3 text-left">
                  {selectedPatient.phone_number || "-"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Alamat
                </Label>
                <p id="address" className="col-span-3 text-left">
                  {selectedPatient.address || "-"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <p id="status" className="col-span-3 text-left capitalize">
                  {selectedPatient.status || "-"}
                </p>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="registeredAt" className="text-right">
                  Terdaftar Sejak
                </Label>
                <p id="registeredAt" className="col-span-3 text-left">
                  {new Date(selectedPatient.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PatientVerification;

