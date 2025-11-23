import { useState } from "react";
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
import { Edit } from "lucide-react";
import EditDrugModal from "./EditDrugModal";

const mockStock = [
  { id: "1", name: "Paracetamol 500mg", stock: 1000, dosage: "500000mg", history: "Ditambah 500 (2024-10-27)" },
  { id: "2", name: "Amoxicillin 250mg", stock: 500, dosage: "125000mg", history: "Dikurangi 50 (2024-10-28)" },
  { id: "3", name: "Loratadine 10mg", stock: 300, dosage: "3000mg", history: "Ditambah 100 (2024-10-26)" },
];

const ViewStock = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedDrug, setSelectedDrug] = useState(null);

  const handleEditClick = (drug) => {
    setSelectedDrug(drug);
    setIsEditModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedDrug(null);
  };

  const handleSave = (updatedDrug) => {
    console.log("Saving updated drug:", updatedDrug);
    // In a real app, you would update the state or make an API call here
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Stok Obat Saat Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead>Sisa Tablet</TableHead>
                <TableHead>Total Dosis Tersisa</TableHead>
                <TableHead>Riwayat Terakhir</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockStock.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.stock}</TableCell>
                  <TableCell>{med.dosage}</TableCell>
                  <TableCell>{med.history}</TableCell>
                  <TableCell>
                    <Button variant="outline" size="sm" onClick={() => handleEditClick(med)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      {isEditModalOpen && (
        <EditDrugModal
          drug={selectedDrug}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </>
  );
};

export default ViewStock;
