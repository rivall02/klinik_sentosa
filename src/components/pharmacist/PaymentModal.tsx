import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

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

interface PaymentModalProps {
  prescription: PrescriptionToDispense;
  onClose: () => void;
  onDispenseSuccess: () => void; // Changed from onPaymentSuccess
}

const PaymentModal = ({ prescription, onClose, onDispenseSuccess }: PaymentModalProps) => {
  const { toast } = useToast();
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  console.log("PaymentModal received prescription:", prescription); // Debugging line

  const total = prescription.prescriptions.reduce(
    (acc, med) => acc + med.total_price_item,
    0
  );

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // 1. Update all prescription statuses to 'dispensed'
      const prescriptionIds = prescription.prescriptions.map(p => p.prescription_id);
      const { error: prescriptError } = await supabase
        .from('prescriptions')
        .update({ status: 'dispensed' })
        .in('id', prescriptionIds);
      if (prescriptError) throw prescriptError;

      // 2. Update appointment status (optional, can be changed to 'selesai')
      const { error: apptError } = await supabase
        .from('appointments')
        .update({ status: 'selesai' })
        .eq('id', prescription.appointment_id);

      if (apptError) throw apptError;

      // 3. Decrement medication stock
      for (const med of prescription.prescriptions) {
        // ... (stock decrement logic)
      }

      // 4. Create a transaction record
      const { error: transactionError } = await supabase
        .from('transactions')
        .insert({
          appointment_id: prescription.appointment_id,
          patient_id: prescription.patient_id,
          total_amount: total,
        });
      if (transactionError) throw transactionError;

      toast({
        title: "Pembayaran Berhasil!",
        description: "Obat berhasil diserahkan dan pembayaran tercatat.",
      });
      onDispenseSuccess(); // Notify parent to refresh
      onClose(); // Close the modal

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pembayaran Gagal",
        description: error.message,
      });
    } finally {
      setIsProcessingPayment(false);
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Pembayaran & Resep</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 text-sm">
          <div>
            <p><strong>Nama Pasien:</strong> {prescription.patient_name}</p>
            <p><strong>No. Janji Temu:</strong> {prescription.appointment_id}</p>
            <p><strong>Tanggal:</strong> {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <Separator />
          <div>
            <p><strong>Gejala:</strong> {prescription.symptoms || '-'}</p>
            <p><strong>Diagnosis:</strong> {prescription.diagnosis || '-'}</p>
            <p><strong>Catatan Dokter:</strong> {prescription.doctor_notes || '-'}</p>
          </div>
          <Separator />
          <h3 className="font-semibold text-md mb-2">Rincian Obat:</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Obat</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Harga Satuan</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescription.prescriptions.map((med) => (
                <TableRow key={med.medication_id}>
                  <TableCell>{med.medication_name}</TableCell>
                  <TableCell>{med.medication_description || '-'}</TableCell>
                  <TableCell>{med.quantity} ({med.dosage_instructions})</TableCell>
                  <TableCell>Rp{med.unit_price.toLocaleString("id-ID")}</TableCell>
                  <TableCell className="text-right">Rp{med.total_price_item.toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
          <div className="flex justify-end font-bold text-lg">
            <p>Total Pembayaran: Rp{total.toLocaleString("id-ID")}</p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isProcessingPayment}>
            Batal
          </Button>
          <Button onClick={handlePayment} disabled={isProcessingPayment}>
            {isProcessingPayment ? 'Memproses...' : 'Bayar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;


