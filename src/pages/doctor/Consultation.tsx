import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";
import { Search, X } from "lucide-react";
import { format } from 'date-fns';

const Consultation = () => {
  const { patientId, appointmentId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetched Data
  const [patient, setPatient] = useState<any>(null);
  const [appointment, setAppointment] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [medicationStock, setMedicationStock] = useState<any[]>([]);

  // Form State
  const [consultationForm, setConsultationForm] = useState({ symptoms: '', diagnosis: '', doctor_notes: '' });
  const [prescription, setPrescription] = useState<{ medication_id: string; name: string; quantity: number; dosage_instructions: string }[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!patientId || !appointmentId) {
      setError("Patient ID atau Appointment ID tidak ditemukan.");
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch all data in parallel
        const [patientRes, appointmentRes, historyRes, medsRes] = await Promise.all([
          supabase.from('patients').select('*').eq('id', patientId).single(),
          supabase.from('appointments').select('*').eq('id', appointmentId).single(),
          supabase.from('consultations').select('*, prescriptions(*, medications(*))').eq('patient_id', patientId).order('created_at', { ascending: false }),
          supabase.from('medications').select('*').order('name', { ascending: true })
        ]);

        if (patientRes.error) throw patientRes.error;
        if (appointmentRes.error) throw appointmentRes.error;
        if (historyRes.error) throw historyRes.error;
        if (medsRes.error) throw medsRes.error;

        setPatient(patientRes.data);
        setAppointment(appointmentRes.data);
        setHistory(historyRes.data);
        setMedicationStock(medsRes.data);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [patientId, appointmentId]);

  const handleAddPrescription = (med: any) => {
    if (prescription.find(p => p.medication_id === med.id)) return; // Avoid duplicates
    setPrescription([...prescription, { medication_id: med.id, name: med.name, quantity: 1, dosage_instructions: "" }]);
  };

  const handleRemovePrescription = (medication_id: string) => {
    setPrescription(prescription.filter(p => p.medication_id !== medication_id));
  };

  const handlePrescriptionChange = (medication_id: string, field: string, value: string | number) => {
    setPrescription(prescription.map(p => p.medication_id === medication_id ? { ...p, [field]: value } : p));
  };

  const handleSaveAndFinish = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
        // 1. Insert new consultation
        const { data: consultationData, error: consultationError } = await supabase
            .from('consultations')
            .insert({
                appointment_id: appointmentId,
                patient_id: patientId,
                symptoms: consultationForm.symptoms,
                diagnosis: consultationForm.diagnosis,
                doctor_notes: consultationForm.doctor_notes,
            })
            .select()
            .single();

        if (consultationError) throw consultationError;

        // 2. Insert prescriptions if any
        if (prescription.length > 0) {
            const prescriptionInsertData = prescription.map(p => ({
                consultation_id: consultationData.id,
                medication_id: p.medication_id,
                quantity: p.quantity,
                dosage_instructions: p.dosage_instructions,
                status: 'pending', // Set initial status to pending
            }));
            const { error: prescriptionError } = await supabase.from('prescriptions').insert(prescriptionInsertData);
            if (prescriptionError) throw prescriptionError;
        }

        // 3. Update appointment status
        const { error: appointmentError } = await supabase
            .from('appointments')
            .update({ status: 'selesai' })
            .eq('id', appointmentId!);
        if (appointmentError) throw appointmentError;
        
        toast({ title: "Sukses!", description: "Data konsultasi dan resep berhasil disimpan." });
        navigate('/doctor/schedule');

    } catch (err: any) {
        toast({ variant: 'destructive', title: "Gagal Menyimpan", description: err.message });
    } finally {
        setIsSubmitting(false);
    }
  };

  const filteredMeds = medicationStock.filter(med => 
    med.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div>Memuat data konsultasi...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!patient || !appointment) return <div>Data pasien atau jadwal tidak ditemukan.</div>;

  return (
    <form onSubmit={handleSaveAndFinish} className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Ruang Konsultasi</h2>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Menyimpan...' : 'Simpan & Selesaikan Konsultasi'}
        </Button>
      </div>

      {/* Patient Details */}
      <Card>
        <CardHeader><CardTitle>Detail Pasien</CardTitle></CardHeader>
        <CardContent className="space-y-2">
          <p><span className="font-semibold">Nama:</span> {patient.full_name}</p>
          <p><span className="font-semibold">No. RM:</span> {patient.medical_record_number}</p>
          <p><span className="font-semibold">Tgl Lahir:</span> {format(new Date(patient.date_of_birth), 'dd MMMM yyyy')}</p>
          <p><span className="font-semibold">Jadwal:</span> {format(new Date(appointment.appointment_time), 'dd MMMM yyyy, HH:mm')}</p>
        </CardContent>
      </Card>
      
      {/* Consultation Form */}
      <Card>
        <CardHeader><CardTitle>Pencatatan Konsultasi</CardTitle></CardHeader>
        <CardContent className="space-y-4">
            <div>
                <Label htmlFor="symptoms">Gejala (Symptoms)</Label>
                <Textarea id="symptoms" value={consultationForm.symptoms} onChange={e => setConsultationForm({...consultationForm, symptoms: e.target.value})} placeholder="Cth: Demam tinggi, sakit kepala..."/>
            </div>
            <div>
                <Label htmlFor="diagnosis">Diagnosis</Label>
                <Textarea id="diagnosis" value={consultationForm.diagnosis} onChange={e => setConsultationForm({...consultationForm, diagnosis: e.target.value})} placeholder="Cth: Infeksi Saluran Pernapasan Akut (ISPA)..." required/>
            </div>
        </CardContent>
      </Card>

      {/* Medication & Prescription Management */}
      <Card>
        <CardHeader><CardTitle>Manajemen Obat & Resep</CardTitle></CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <h3 className="font-semibold mb-4">Cari & Tambah Obat</h3>
            <div className="relative mb-4"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input placeholder="Cari obat..." className="pl-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}/></div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">{filteredMeds.map(med => (<div key={med.id} className="flex justify-between items-center p-2 rounded-md hover:bg-muted"><div><p className="font-medium">{med.name}</p><p className="text-sm text-muted-foreground">Stok: {med.stock}</p></div><Button size="sm" type="button" onClick={() => handleAddPrescription(med)}>Tambah</Button></div>))}</div>
          </div>
          <div className="md:col-span-2">
            <h3 className="font-semibold mb-4">Resep Pasien</h3>
            <Table>
              <TableHeader><TableRow><TableHead>Obat</TableHead><TableHead>Jumlah</TableHead><TableHead>Dosis/Aturan Pakai</TableHead><TableHead>Aksi</TableHead></TableRow></TableHeader>
              <TableBody>
                {prescription.map(p => (<TableRow key={p.medication_id}><TableCell>{p.name}</TableCell><TableCell><Input type="number" value={p.quantity} onChange={(e) => handlePrescriptionChange(p.medication_id, 'quantity', parseInt(e.target.value))} className="w-20 h-8" /></TableCell><TableCell><Input type="text" placeholder="Cth: 3x1 setelah makan" value={p.dosage_instructions} onChange={(e) => handlePrescriptionChange(p.medication_id, 'dosage_instructions', e.target.value)} className="h-8"/></TableCell><TableCell><Button variant="ghost" size="icon" type="button" onClick={() => handleRemovePrescription(p.medication_id)}><X className="w-4 h-4" /></Button></TableCell></TableRow>))}
              </TableBody>
            </Table>
            <div className="mt-8">
              <Label htmlFor="doctor-notes">Catatan Tambahan untuk Apoteker</Label>
              <Textarea id="doctor-notes" value={consultationForm.doctor_notes} onChange={e => setConsultationForm({...consultationForm, doctor_notes: e.target.value})} placeholder="Informasi penting lainnya tentang resep atau obat..."/>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Consultation History */}
      <Card>
        <CardHeader><CardTitle>Riwayat Konsultasi Pasien</CardTitle></CardHeader>
        <CardContent>
            {history.length > 0 ? (
                 <div className="space-y-4">
                    {history.map(h => (
                        <Card key={h.id} className="bg-muted/50">
                            <CardHeader><CardTitle className="text-base">{format(new Date(h.created_at), 'dd MMMM yyyy')}</CardTitle><CardDescription>Diagnosis: {h.diagnosis}</CardDescription></CardHeader>
                            <CardContent>
                                <p className="text-sm"><span className="font-semibold">Gejala:</span> {h.symptoms}</p>
                                <p className="text-sm"><span className="font-semibold">Catatan Dokter:</span> {h.doctor_notes}</p>
                                {h.prescriptions.length > 0 && (
                                    <div className="mt-2">
                                        <p className="text-sm font-semibold">Resep yang diberikan:</p>
                                        <ul className="list-disc pl-5 text-sm">
                                            {h.prescriptions.map((pr: any) => (
                                                <li key={pr.id}>{pr.medications.name} ({pr.quantity}) - {pr.dosage_instructions}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                 </div>
            ) : <p>Tidak ada riwayat konsultasi.</p>}
        </CardContent>
      </Card>

    </form>
  );
};

export default Consultation;
