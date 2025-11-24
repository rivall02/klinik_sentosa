import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogTrigger,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MoreHorizontal } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

const StockManagement = () => {
  const [medications, setMedications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [medicationToEdit, setMedicationToEdit] = useState<any | null>(null);
  const [medicationToDelete, setMedicationToDelete] = useState<any | null>(null);

  const initialFormData = { name: '', description: '', stock_quantity: 0, unit_price: 0, category: '', expiration_date: '', unit: 'tablet' };
  const [formData, setFormData] = useState(initialFormData);

  useEffect(() => {
    const fetchMedications = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('medications').select('*').order('name', { ascending: true });
        if (error) throw error;
        setMedications(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMedications();
  }, [refreshKey]);

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('medications').insert([{ ...formData, stock_quantity: Number(formData.stock_quantity), unit_price: Number(formData.unit_price) }]);
      if (error) throw error;
      toast({ title: "Sukses", description: "Obat baru berhasil ditambahkan." });
      setIsAddDialogOpen(false);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Gagal", description: err.message });
    }
  };

  const handleEditClick = (med: any) => {
    setMedicationToEdit(med);
    setFormData({
      name: med.name,
      description: med.description || '',
      stock_quantity: med.stock_quantity,
      unit_price: med.unit_price,
      category: med.category || '',
      expiration_date: med.expiration_date || '',
      unit: med.unit || 'tablet'
    });
  };

  const handleUpdateMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!medicationToEdit) return;
    try {
      const { id, ...updateData } = formData; // Exclude id if it exists
      const { error } = await supabase.from('medications').update(updateData).eq('id', medicationToEdit.id);
      if (error) throw error;
      toast({ title: "Sukses", description: "Data obat berhasil diperbarui." });
      setMedicationToEdit(null);
      setRefreshKey(prev => prev + 1);
    } catch (err: any) {
      toast({ variant: 'destructive', title: "Gagal", description: err.message });
    }
  };
  
  const handleDeleteMedication = async () => {
    if (!medicationToDelete) return;
    try {
      const { error } = await supabase.from('medications').delete().eq('id', medicationToDelete.id);
      if (error) throw error;
      
      toast({ title: "Sukses", description: `Obat ${medicationToDelete.name} telah dihapus.` });
      
      // Immediately filter the state to update the UI
      setMedications(currentMeds => currentMeds.filter(med => med.id !== medicationToDelete.id));
      setMedicationToDelete(null);
    } catch (err: any) {
      toast({ variant: "destructive", title: "Gagal", description: err.message });
    }
  };

  if (loading) return <div>Memuat data obat...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manajemen Stok Obat</CardTitle>
        <Dialog open={isAddDialogOpen} onOpenChange={(isOpen) => { if (!isOpen) setFormData(initialFormData); setIsAddDialogOpen(isOpen); }}>
          <DialogTrigger asChild><Button>Tambah Obat Baru</Button></DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Tambah Obat Baru</DialogTitle></DialogHeader>
            <form onSubmit={handleAddMedication} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-name">Nama Obat</Label>
                  <Input id="add-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-stock">Stok Awal</Label>
                  <Input id="add-stock" type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="add-price">Harga Satuan</Label>
                  <Input id="add-price" type="number" value={formData.unit_price} onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-unit">Satuan</Label>
                   <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger><SelectValue placeholder="Pilih Satuan" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                        <SelectItem value="strip">Strip</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-category">Kategori</Label>
                  <Input id="add-category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-exp">Tanggal Kadaluarsa</Label>
                  <Input id="add-exp" type="date" value={formData.expiration_date} onChange={(e) => setFormData({...formData, expiration_date: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="add-desc">Deskripsi</Label>
                  <Textarea id="add-desc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                <Button type="submit">Simpan Obat</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader><TableRow><TableHead>Nama Obat</TableHead><TableHead>Stok</TableHead><TableHead>Satuan</TableHead><TableHead>Harga</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
          <TableBody>
            {medications.map((med) => (
              <TableRow key={med.id}>
                <TableCell>{med.name}</TableCell><TableCell>{med.stock_quantity}</TableCell><TableCell>{med.unit}</TableCell><TableCell>Rp {med.unit_price.toLocaleString('id-ID')}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild><Button variant="ghost" className="h-8 w-8 p-0"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEditClick(med)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={() => setMedicationToDelete(med)}>Hapus</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>

      {/* Edit Dialog */}
      <Dialog open={!!medicationToEdit} onOpenChange={(isOpen) => { if (!isOpen) setMedicationToEdit(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Obat: {medicationToEdit?.name}</DialogTitle></DialogHeader>
           <form onSubmit={handleUpdateMedication} className="space-y-4 py-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-name">Nama Obat</Label>
                  <Input id="edit-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-stock">Stok</Label>
                  <Input id="edit-stock" type="number" value={formData.stock_quantity} onChange={(e) => setFormData({...formData, stock_quantity: parseInt(e.target.value) || 0})} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Harga Satuan</Label>
                  <Input id="edit-price" type="number" value={formData.unit_price} onChange={(e) => setFormData({...formData, unit_price: parseFloat(e.target.value) || 0})} required />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-unit">Satuan</Label>
                   <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                      <SelectTrigger><SelectValue placeholder="Pilih Satuan" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tablet">Tablet</SelectItem>
                        <SelectItem value="pcs">Pcs</SelectItem>
                        <SelectItem value="botol">Botol</SelectItem>
                        <SelectItem value="strip">Strip</SelectItem>
                      </SelectContent>
                   </Select>
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-category">Kategori</Label>
                  <Input id="edit-category" value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-exp">Tanggal Kadaluarsa</Label>
                  <Input id="edit-exp" type="date" value={formData.expiration_date} onChange={(e) => setFormData({...formData, expiration_date: e.target.value})} />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="edit-desc">Deskripsi</Label>
                  <Textarea id="edit-desc" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild><Button type="button" variant="outline">Batal</Button></DialogClose>
                <Button type="submit">Simpan Perubahan</Button>
              </DialogFooter>
           </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!medicationToDelete} onOpenChange={() => setMedicationToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Anda yakin?</AlertDialogTitle></AlertDialogHeader>
          <AlertDialogDescription>Tindakan ini akan menghapus <span className="font-bold">{medicationToDelete?.name}</span> secara permanen.</AlertDialogDescription>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedication}>Ya, Hapus</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default StockManagement;