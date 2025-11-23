import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import PaymentModal from "./PaymentModal";

const prescriptions = [
  {
    patientName: "Ahmad Santoso",
    patientId: "PID-456",
    prescriptionId: "PRE-001",
    date: "2025-11-23",
    doctor: "Dr. Budi",
    status: "Menunggu",
    medications: [
      { name: "Paracetamol 500mg", qty: 20, price: 2000 },
      { name: "Amoxicillin 250mg", qty: 15, price: 5000 },
    ],
  },
  {
    patientName: "Siti Aminah",
    patientId: "PID-789",
    prescriptionId: "PRE-002",
    date: "2025-11-23",
    doctor: "Dr. Budi",
    status: "Menunggu",
    medications: [{ name: "Loratadine 10mg", qty: 10, price: 3000 }],
  },
];

const DispenseDrug = () => {
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleProcessClick = (prescription) => {
    setSelectedPrescription(prescription);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pengambilan Obat</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID Resep</TableHead>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Dokter</TableHead>
            <TableHead>Tanggal</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.map((p) => (
            <TableRow key={p.prescriptionId}>
              <TableCell>{p.prescriptionId}</TableCell>
              <TableCell>{p.patientName}</TableCell>
              <TableCell>{p.doctor}</TableCell>
              <TableCell>{p.date}</TableCell>
              <TableCell>{p.status}</TableCell>
              <TableCell>
                <Button onClick={() => handleProcessClick(p)}>Proses</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {isPaymentModalOpen && selectedPrescription && (
        <PaymentModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default DispenseDrug;
