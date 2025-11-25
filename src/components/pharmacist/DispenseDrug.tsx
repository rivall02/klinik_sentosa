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

interface MedicationDetail {
  prescription_id: string;
  quantity: number;
  dosage_instructions: string;
  medication_id: string;
  medication_name: string;
  unit_price: number;
  medication_description: string;
  total_price_item: number;
}

interface PrescriptionToDispense {
  appointment_id: string;
  patient_id: string;
  patient_name: string;
  consultation_id: string;
  symptoms: string;
  diagnosis: string;
  doctor_notes: string;
  prescriptions: MedicationDetail[];
}

interface DispenseDrugProps {
  prescriptions: PrescriptionToDispense[];
  onDispenseSuccess: () => void;
}

const DispenseDrug = ({ prescriptions, onDispenseSuccess }: DispenseDrugProps) => {
  const [selectedPrescription, setSelectedPrescription] = useState<PrescriptionToDispense | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  const handleProcessClick = (prescription: PrescriptionToDispense) => {
    setSelectedPrescription(prescription);
    setIsPaymentModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedPrescription(null);
  };

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Janji Temu</TableHead>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Diagnosis</TableHead>
            <TableHead>Obat</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prescriptions.length > 0 ? (
            prescriptions.map((p) => (
              <TableRow key={p.appointment_id}>
                <TableCell>{p.appointment_id.substring(0, 8)}...</TableCell>
                <TableCell>{p.patient_name}</TableCell>
                <TableCell>{p.diagnosis}</TableCell>
                <TableCell>
                  <ul className="list-disc list-inside">
                    {p.prescriptions?.map((med) => (
                      <li key={med.medication_id}>
                        {med.medication_name} ({med.quantity})
                      </li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleProcessClick(p)}>Proses</Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">Tidak ada resep yang perlu diproses.</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {isPaymentModalOpen && selectedPrescription && (
        <PaymentModal
          prescription={selectedPrescription}
          onClose={handleCloseModal}
          onDispenseSuccess={onDispenseSuccess}
        />
      )}
    </div>
  );
};

export default DispenseDrug;
