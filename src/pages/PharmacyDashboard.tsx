import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PharmacyDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const prescriptions = [
    {
      id: "1",
      code: "PD123",
      patient: "Jane Smith",
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", quantity: "10 tablets" },
        { name: "Paracetamol", dosage: "500mg", quantity: "20 tablets" },
      ],
      status: "pending",
      timestamp: "11:30",
    },
    {
      id: "2",
      code: "PD124",
      patient: "Mike Johnson",
      medicines: [
        { name: "Ibuprofen", dosage: "400mg", quantity: "15 tablets" },
      ],
      status: "pending",
      timestamp: "11:45",
    },
  ];

  const handlePrepareComplete = () => {
    setPaymentAmount("150000");
    toast({
      title: "Obat Siap",
      description: "Lanjut ke pembayaran",
    });
  };

  const handleCompleteTransaction = () => {
    toast({
      title: "Transaksi Selesai",
      description: "Obat telah diserahkan ke pasien",
    });
    setSelectedPrescription(null);
    setPaymentAmount("");
    setPaymentMethod("");
  };

  const selected = prescriptions.find((p) => p.id === selectedPrescription);

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-6xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/staff")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Prescription Queue */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Antrian Resep
              </h2>
              <div className="space-y-3">
                {prescriptions.map((prescription) => (
                  <div
                    key={prescription.id}
                    className={`p-4 rounded-lg border cursor-pointer ${
                      selectedPrescription === prescription.id
                        ? "bg-primary/5 border-primary"
                        : "bg-card border-border"
                    }`}
                    onClick={() => setSelectedPrescription(prescription.id)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <div className="font-bold text-primary">
                          {prescription.code}
                        </div>
                        <div className="text-sm text-foreground">
                          {prescription.patient}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {prescription.timestamp}
                        </div>
                      </div>
                      <Badge variant="secondary">
                        menunggu
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Prescription Details & Payment */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Detail Resep
              </h2>

              {selected ? (
                <div className="space-y-6">
                  <div>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">
                        Kode Resep
                      </div>
                      <div className="text-2xl font-bold text-primary">
                        {selected.code}
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground">
                        Nama Pasien
                      </div>
                      <div className="font-semibold">{selected.patient}</div>
                    </div>
                  </div>

                  <div>
                    <Label className="mb-3 block">Obat-obatan</Label>
                    <div className="space-y-2">
                      {selected.medicines.map((medicine, index) => (
                        <div
                          key={index}
                          className="p-3 bg-medical-gray rounded-lg"
                        >
                          <div className="font-medium">{medicine.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {medicine.dosage} - {medicine.quantity}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!paymentAmount ? (
                    <Button
                      onClick={handlePrepareComplete}
                      size="lg"
                      className="w-full"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Siap Diambil & Lanjut ke Pembayaran
                    </Button>
                  ) : (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Total Pembayaran</Label>
                        <Input
                          value={paymentAmount}
                          onChange={(e) => setPaymentAmount(e.target.value)}
                          placeholder="Masukkan jumlah"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Metode Pembayaran</Label>
                        <div className="grid grid-cols-3 gap-2">
                          <Button
                            variant={paymentMethod === "cash" ? "default" : "outline"}
                            onClick={() => setPaymentMethod("cash")}
                          >
                            Tunai
                          </Button>
                          <Button
                            variant={paymentMethod === "debit" ? "default" : "outline"}
                            onClick={() => setPaymentMethod("debit")}
                          >
                            Debit
                          </Button>
                          <Button
                            variant={paymentMethod === "transfer" ? "default" : "outline"}
                            onClick={() => setPaymentMethod("transfer")}
                          >
                            Transfer
                          </Button>
                        </div>
                      </div>
                      <Button
                        onClick={handleCompleteTransaction}
                        size="lg"
                        className="w-full"
                        disabled={!paymentMethod}
                      >
                        Selesaikan Transaksi
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  Pilih resep untuk diproses
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PharmacyDashboard;
