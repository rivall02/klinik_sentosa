import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";

const EditDrugModal = ({ drug, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    dosage: "",
  });

  useEffect(() => {
    if (drug) {
      setFormData({
        name: drug.name,
        stock: drug.stock,
        dosage: drug.dosage,
      });
    }
  }, [drug]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = () => {
    onSave({ ...drug, ...formData });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Detail Obat</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Obat</Label>
            <Input id="name" value={formData.name} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Sisa Tablet</Label>
            <Input id="stock" type="number" value={formData.stock} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dosage">Total Dosis Tersisa</Label>
            <Input id="dosage" value={formData.dosage} onChange={handleChange} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Batal</Button>
          <Button onClick={handleSave}>Simpan Perubahan</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditDrugModal;
