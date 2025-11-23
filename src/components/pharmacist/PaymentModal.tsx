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

const PaymentModal = ({ prescription, onClose }) => {
  const total = prescription.medications.reduce(
    (acc, med) => acc + med.qty * med.price,
    0
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pembayaran Resep - {prescription.prescriptionId}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <p><strong>Nama Pasien:</strong> {prescription.patientName}</p>
            <p><strong>Dokter:</strong> {prescription.doctor}</p>
          </div>
          <Separator />
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Obat</TableHead>
                <TableHead>Jumlah</TableHead>
                <TableHead>Harga</TableHead>
                <TableHead>Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {prescription.medications.map((med) => (
                <TableRow key={med.name}>
                  <TableCell>{med.name}</TableCell>
                  <TableCell>{med.qty}</TableCell>
                  <TableCell>Rp{med.price.toLocaleString("id-ID")}</TableCell>
                  <TableCell>Rp{(med.qty * med.price).toLocaleString("id-ID")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Separator />
          <div className="flex justify-end font-bold text-lg">
            <p>Total: Rp{total.toLocaleString("id-ID")}</p>
          </div>
          <div>
            {/* Payment options can be added here */}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Batal
          </Button>
          <Button>Bayar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentModal;
