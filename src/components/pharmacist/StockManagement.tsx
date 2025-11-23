import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const StockManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Manajemen Stok</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Dialog>
          <DialogTrigger asChild>
            <Button>Tambah Obat Baru</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Tambah Obat Baru</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Obat</Label>
                <Input id="name" placeholder="e.g., Paracetamol 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="form">Bentuk</Label>
                <Input id="form" placeholder="e.g., Tablet" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dosage">Dosis</Label>
                <Input id="dosage" placeholder="e.g., 500mg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi</Label>
                <Input id="description" placeholder="e.g., Obat penurun panas" />
              </div>
              <Button className="w-full">Simpan Obat</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <p className="text-muted-foreground">
          Untuk menambah atau mengurangi stok, silakan lihat daftar obat di tab "Lihat Stok Obat" dan pilih aksi dari sana.
        </p>
      </CardContent>
    </Card>
  );
};

export default StockManagement;
