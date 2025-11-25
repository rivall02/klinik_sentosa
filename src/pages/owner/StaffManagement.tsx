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
  DialogFooter,
  DialogClose,
  DialogTrigger,
  DialogDescription,
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MoreHorizontal, UserPlus } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const StaffManagement = () => {
  const [staffList, setStaffList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const [isAddStaffDialogOpen, setIsAddStaffDialogOpen] = useState(false);
  const initialAddForm = { full_name: '', email: '', password: '', role: 'doctor', phone_number: '', address: '', gender: 'Laki-laki', date_of_birth: '' };
  const [newStaffFormData, setNewStaffFormData] = useState(initialAddForm);
  
  const [staffToView, setStaffToView] = useState<any | null>(null);
  const [staffToEdit, setStaffToEdit] = useState<any | null>(null);
  const [staffToDelete, setStaffToDelete] = useState<any | null>(null);

  const [editFormData, setEditFormData] = useState({ full_name: '', role: '', email: '', password: '', phone_number: '', address: '', gender: '', date_of_birth: '' });

  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('profiles').select('*').order('full_name', { ascending: true });
        if (error) throw error;
        setStaffList(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, [refreshKey]);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-staff-user', { body: newStaffFormData });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast({ title: "Sukses", description: `Staff ${newStaffFormData.full_name} berhasil ditambahkan.` });
      setNewStaffFormData(initialAddForm);
      setIsAddStaffDialogOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Gagal", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (staff: any) => {
    setStaffToEdit(staff);
    setEditFormData({
      full_name: staff.full_name || '',
      role: staff.role || 'doctor',
      email: staff.email || '',
      phone_number: staff.phone_number || '',
      address: staff.address || '',
      gender: staff.gender || 'Laki-laki',
      date_of_birth: staff.date_of_birth || '',
      password: '',
    });
  };

  const handleUpdateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!staffToEdit) return;
    setIsSubmitting(true);
    const updates: any = { ...editFormData };
    if (!updates.password?.trim()) {
      delete updates.password;
    }
    try {
      const { data, error } = await supabase.functions.invoke('update-staff-user', { body: { user_id: staffToEdit.id, updates: updates } });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast({ title: "Sukses", description: "Data staff berhasil diperbarui." });
      setStaffToEdit(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Gagal", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteStaff = async () => {
    if (!staffToDelete) return;
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke('delete-staff-user', { body: { user_id: staffToDelete.id } });
      if (error) throw error;
      if (data.error) throw new Error(data.error);
      toast({ title: "Sukses", description: `Staff ${staffToDelete.full_name} berhasil dihapus.` });
      setStaffToDelete(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Gagal", description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div>Memuat daftar staff...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manajemen Staff</h2>
        <Dialog open={isAddStaffDialogOpen} onOpenChange={setIsAddStaffDialogOpen}>
          <DialogTrigger asChild><Button onClick={() => setNewStaffFormData(initialAddForm)}><UserPlus className="mr-2 h-4 w-4"/> Tambah Staff Baru</Button></DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader><DialogTitle>Tambah Staff Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleAddStaff} className="grid gap-4 py-4">
              <div className="grid gap-2"><Label>Nama Lengkap</Label><Input value={newStaffFormData.full_name} onChange={e => setNewStaffFormData({...newStaffFormData, full_name: e.target.value})} required/></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2"><Label>Tanggal Lahir</Label><Input type="date" value={newStaffFormData.date_of_birth} onChange={e => setNewStaffFormData({...newStaffFormData, date_of_birth: e.target.value})}/></div>
                <div className="grid gap-2"><Label>Jenis Kelamin</Label><Select value={newStaffFormData.gender} onValueChange={value => setNewStaffFormData({...newStaffFormData, gender: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent></Select></div>
              </div>
              <div className="grid gap-2"><Label>Email</Label><Input type="email" value={newStaffFormData.email} onChange={e => setNewStaffFormData({...newStaffFormData, email: e.target.value})} required/></div>
              <div className="grid gap-2"><Label>Password</Label><Input type="password" value={newStaffFormData.password} onChange={e => setNewStaffFormData({...newStaffFormData, password: e.target.value})} required/></div>
              <div className="grid gap-2"><Label>No. HP</Label><Input value={newStaffFormData.phone_number} onChange={e => setNewStaffFormData({...newStaffFormData, phone_number: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Alamat</Label><Input value={newStaffFormData.address} onChange={e => setNewStaffFormData({...newStaffFormData, address: e.target.value})} /></div>
              <div className="grid gap-2"><Label>Role</Label><Select value={newStaffFormData.role} onValueChange={value => setNewStaffFormData({...newStaffFormData, role: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="doctor">Dokter</SelectItem><SelectItem value="pharmacist">Apoteker</SelectItem><SelectItem value="owner">Owner</SelectItem></SelectContent></Select></div>
              <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menambahkan...' : 'Tambah Staff'}</Button></DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader><TableRow><TableHead>Nama</TableHead><TableHead>Email</TableHead><TableHead>Role</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
        <TableBody>
          {staffList.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{staff.full_name}</TableCell><TableCell>{staff.email}</TableCell><TableCell><Badge>{staff.role}</Badge></TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal/></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setStaffToView(staff)}>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleEditClick(staff)}>Edit</DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600" onClick={() => setStaffToDelete(staff)}>Hapus</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!staffToView} onOpenChange={() => setStaffToView(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Detail Staff</DialogTitle></DialogHeader>
          {staffToView && <div className="py-4 space-y-2 text-sm"><p><strong>Nama:</strong> {staffToView.full_name}</p><p><strong>Email:</strong> {staffToView.email}</p><p><strong>Role:</strong> <Badge>{staffToView.role}</Badge></p><p><strong>No. HP:</strong> {staffToView.phone_number || '-'}</p><p><strong>Alamat:</strong> {staffToView.address || '-'}</p><p><strong>Jenis Kelamin:</strong> {staffToView.gender || '-'}</p><p><strong>Tgl. Lahir:</strong> {staffToView.date_of_birth ? new Date(staffToView.date_of_birth).toLocaleDateString('id-ID') : '-'}</p></div>}
        </DialogContent>
      </Dialog>
      
      <Dialog open={!!staffToEdit} onOpenChange={() => setStaffToEdit(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader><DialogTitle>Edit Staff: {staffToEdit?.full_name}</DialogTitle></DialogHeader>
          <form onSubmit={handleUpdateStaff} className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nama Lengkap</Label><Input value={editFormData.full_name} onChange={e => setEditFormData({...editFormData, full_name: e.target.value})} required/></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Tanggal Lahir</Label><Input type="date" value={editFormData.date_of_birth} onChange={e => setEditFormData({...editFormData, date_of_birth: e.target.value})}/></div>
              <div className="grid gap-2"><Label>Jenis Kelamin</Label><Select value={editFormData.gender} onValueChange={value => setEditFormData({...editFormData, gender: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="Laki-laki">Laki-laki</SelectItem><SelectItem value="Perempuan">Perempuan</SelectItem></SelectContent></Select></div>
            </div>
            <div className="grid gap-2"><Label>Email</Label><Input type="email" value={editFormData.email} onChange={e => setEditFormData({...editFormData, email: e.target.value})} required/></div>
            <div className="grid gap-2"><Label>Password Baru</Label><Input type="password" value={editFormData.password} onChange={e => setEditFormData({...editFormData, password: e.target.value})} placeholder="Kosongkan jika tidak ingin ganti"/></div>
            <div className="grid gap-2"><Label>No. HP</Label><Input value={editFormData.phone_number} onChange={e => setEditFormData({...editFormData, phone_number: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Alamat</Label><Input value={editFormData.address} onChange={e => setEditFormData({...editFormData, address: e.target.value})} /></div>
            <div className="grid gap-2"><Label>Role</Label><Select value={editFormData.role} onValueChange={value => setEditFormData({...editFormData, role: value})}><SelectTrigger><SelectValue/></SelectTrigger><SelectContent><SelectItem value="admin">Admin</SelectItem><SelectItem value="doctor">Dokter</SelectItem><SelectItem value="pharmacist">Apoteker</SelectItem><SelectItem value="owner">Owner</SelectItem></SelectContent></Select></div>
            <DialogFooter><DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose><Button type="submit" disabled={isSubmitting}>{isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}</Button></DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={!!staffToDelete} onOpenChange={() => setStaffToDelete(null)}>
        <AlertDialogContent><AlertDialogHeader><AlertDialogTitle>Yakin ingin hapus?</AlertDialogTitle></AlertDialogHeader><AlertDialogDescription>Akun staff <span className="font-bold">{staffToDelete?.full_name}</span> akan dihapus permanen.</AlertDialogDescription><AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><Button variant="destructive" onClick={handleDeleteStaff} disabled={isSubmitting}>{isSubmitting ? 'Menghapus...' : 'Ya, Hapus'}</Button></AlertDialogFooter></AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StaffManagement;