import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const PatientData = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  // State for dialogs
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<any | null>(null);
  const [patientToEdit, setPatientToEdit] = useState<any | null>(null);
  
  // State for edit form
  const [editFormData, setEditFormData] = useState({
    full_name: "",
    medical_record_number: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch patients
        const { data: patientsData, error: patientsError } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });
        if (patientsError) throw patientsError;
        setPatients(patientsData);

      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [refreshKey]);

  // --- Handlers ---
  const handleViewDetails = (patient: any) => {
    setSelectedPatient(patient);
  };

  const handleEditClick = (patient: any) => {
    setPatientToEdit(patient);
    setEditFormData({
      full_name: patient.full_name || "",
      medical_record_number: patient.medical_record_number || "",
      phone_number: patient.phone_number || "",
      address: patient.address || "",
      date_of_birth: patient.date_of_birth || "",
    });
  };

  const handleUpdatePatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientToEdit) return;

    try {
      const { error } = await supabase
        .from('patients')
        .update(editFormData)
        .eq('id', patientToEdit.id);

      if (error) throw error;
      
      toast({ title: "Sukses", description: "Data pasien berhasil diperbarui." });
      setPatientToEdit(null);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal", description: error.message });
    }
  };

  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', patientToDelete.id);

      if (error) throw error;

      toast({ title: "Pasien Dihapus", description: `Data pasien bernama ${patientToDelete.full_name} telah dihapus.` });
      setPatientToDelete(null);
      setRefreshKey(prev => prev + 1);
    } catch (error: any) {
      toast({ variant: "destructive", title: "Gagal Menghapus", description: error.message });
    }
  };

  if (loading) return <div>Memuat data semua pasien...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Data Semua Pasien</h2>
      <p className="text-muted-foreground mb-4">Daftar ini berisi semua pasien yang pernah terdaftar di sistem.</p>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>No. Rekam Medis</TableHead>
            <TableHead>Telepon</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell className="cursor-pointer hover:underline" onClick={() => handleViewDetails(patient)}>{patient.full_name}</TableCell>
              <TableCell>{patient.medical_record_number || "-"}</TableCell>
              <TableCell>{patient.phone_number || "-"}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0"><span className="sr-only">Menu</span><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleViewDetails(patient)}>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(patient)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => setPatientToDelete(patient)}>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      {/* View Detail Dialog */}
      <Dialog open={!!selectedPatient} onOpenChange={() => setSelectedPatient(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detail Pasien</DialogTitle>
            <DialogDescription>Informasi lengkap mengenai pasien ini.</DialogDescription>
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
      
      {/* Edit Patient Dialog */}
      <Dialog open={!!patientToEdit} onOpenChange={() => setPatientToEdit(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Data Pasien</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdatePatient} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-full_name" className="text-right">Nama</Label>
              <Input id="edit-full_name" value={editFormData.full_name} onChange={(e) => setEditFormData({...editFormData, full_name: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-medical_record_number" className="text-right">No. RM</Label>
              <Input id="edit-medical_record_number" value={editFormData.medical_record_number} onChange={(e) => setEditFormData({...editFormData, medical_record_number: e.target.value})} className="col-span-3" />
            </div>
             <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-date_of_birth" className="text-right">Tgl. Lahir</Label>
              <Input id="edit-date_of_birth" type="date" value={editFormData.date_of_birth} onChange={(e) => setEditFormData({...editFormData, date_of_birth: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-phone_number" className="text-right">Telepon</Label>
              <Input id="edit-phone_number" value={editFormData.phone_number} onChange={(e) => setEditFormData({...editFormData, phone_number: e.target.value})} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="edit-address" className="text-right">Alamat</Label>
              <Input id="edit-address" value={editFormData.address} onChange={(e) => setEditFormData({...editFormData, address: e.target.value})} className="col-span-3" />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
              <Button type="submit">Simpan Perubahan</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!patientToDelete} onOpenChange={() => setPatientToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Apakah Anda yakin?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogDescription>Tindakan ini akan menghapus data pasien bernama <span className="font-bold">{patientToDelete?.full_name}</span> secara permanen.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePatient}>Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PatientData;
