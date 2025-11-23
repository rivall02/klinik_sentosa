import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const patients = [
    { id: "1", number: "A102", name: "Jane Smith", age: 28, gender: "Perempuan" },
    { id: "2", number: "A103", name: "Mike Johnson", age: 45, gender: "Laki-laki" },
    { id: "3", number: "A104", name: "Sarah Williams", age: 62, gender: "Perempuan" },
  ];

const consultationStatusSteps = [
  "Dipanggil",
  "Dalam Konsultasi",
  "Diberikan Obat",
  "Selesai",
];

const availableMedication = [
  { id: "1", name: "Paracetamol 500mg", stock: 1000, dosage: "500000mg" },
  { id: "2", name: "Amoxicillin 250mg", stock: 500, dosage: "125000mg" },
  { id: "3", name: "Loratadine 10mg", stock: 300, dosage: "3000mg" },
];

const Consultation = () => {
  const { patientId } = useParams();
  const [patientDetails, setPatientDetails] = useState(null);
  const [currentStatus, setCurrentStatus] = useState("Dalam Konsultasi");
  const [prescription, setPrescription] = useState<{ id: string; name: string; qty: number; unit: string; notes: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctorNotes, setDoctorNotes] = useState("");

  useEffect(() => {
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setPatientDetails(patient);
    }
  }, [patientId]);

  const handleAddPrescription = (med: { id: string; name: string }) => {
    setPrescription([...prescription, { ...med, qty: 10, unit: "tablet", notes: "" }]); // Default qty, unit, and notes
  };

  const handleRemovePrescription = (id: string) => {
    setPrescription(prescription.filter(p => p.id !== id));
  };

  const handlePrescriptionChange = (id: string, field: string, value: string | number) => {
    setPrescription(prescription.map(p => p.id === id ? { ...p, [field]: value } : p));
  };
  
  const filteredMeds = availableMedication.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!patientDetails) {
    return <div>Loading patient details...</div>;
  }

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Ruang Konsultasi</h2>

      {/* Patient & Status */}
      <div className="grid md:grid-cols-3 gap-8">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Detail Pasien</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p><span className="font-semibold">Nama:</span> {patientDetails.name}</p>
            <p><span className="font-semibold">ID:</span> {patientDetails.id}</p>
            <p><span className="font-semibold">Usia:</span> {patientDetails.age} tahun</p>
            <p><span className="font-semibold">Jenis Kelamin:</span> {patientDetails.gender}</p>
          </CardContent>
        </Card>
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Status Konsultasi</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            {consultationStatusSteps.map((status, index) => (
              <>
                <div key={status} className="flex flex-col items-center gap-2">
                  <Badge
                    variant={
                      consultationStatusSteps.indexOf(currentStatus) >= index
                        ? "default"
                        : "secondary"
                    }
                    className="w-24 justify-center"
                  >
                    {status}
                  </Badge>
                </div>
                {index < consultationStatusSteps.length - 1 && (
                  <div className="flex-1 h-0.5 bg-muted" />
                )}
              </>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Medication Management */}
      <Card>
        <CardHeader>
          <CardTitle>Manajemen Obat & Resep</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Cari & Tambah Obat</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input 
                placeholder="Cari obat..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {filteredMeds.map(med => (
                <div key={med.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Stok: {med.stock} tablet
                    </p>
                  </div>
                  <Button size="sm" onClick={() => handleAddPrescription(med)}>
                    Tambah
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Resep Pasien</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Obat</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Catatan</TableHead>
                  <TableHead>Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {prescription.map(p => (
                  <TableRow key={p.id}>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={p.qty} 
                        onChange={(e) => handlePrescriptionChange(p.id, 'qty', parseInt(e.target.value))}
                        className="w-20 h-8" 
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={p.unit} 
                        onValueChange={(value) => handlePrescriptionChange(p.id, 'unit', value)}
                      >
                        <SelectTrigger className="w-[100px] h-8">
                          <SelectValue placeholder="Unit" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="tablet">Tablet</SelectItem>
                          <SelectItem value="pcs">Pcs</SelectItem>
                          <SelectItem value="botol">Botol</SelectItem>
                          <SelectItem value="strip">Strip</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="text" 
                        placeholder="Cth: 3x1 setelah makan"
                        value={p.notes} 
                        onChange={(e) => handlePrescriptionChange(p.id, 'notes', e.target.value)}
                        className="w-48 h-8"
                      />
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemovePrescription(p.id)}>
                        <X className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="mt-8">
              <Label htmlFor="doctor-notes" className="mb-2 block">Catatan Dokter (Instruksi Dosis & Informasi Lainnya)</Label>
              <Textarea 
                id="doctor-notes" 
                placeholder="Misal: Diminum 3x sehari setelah makan, atau setiap 8 jam. Informasi penting lainnya tentang obat..."
                value={doctorNotes}
                onChange={(e) => setDoctorNotes(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button className="w-full mt-4">Simpan & Selesaikan Konsultasi</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Consultation;
