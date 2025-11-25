import { useState, useEffect } from "react";
import DispenseDrug from "@/components/pharmacist/DispenseDrug";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/hooks/use-toast";

interface MedicationDetail {
  prescription_id: string;
  quantity: number;
  dosage_instructions: string;
  medication_id: string;
  medication_name: string;
  unit_price: number;
  medication_unit: string;
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

const PengambilanObat = () => {
  const [prescriptionsToDispense, setPrescriptionsToDispense] = useState<PrescriptionToDispense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    const fetchPrescriptionData = async () => {
      setLoading(true);
      try {
        // New, more direct query strategy
        const { data: pendingPrescriptions, error } = await supabase
          .from('prescriptions')
          .select(`
            id,
            quantity,
            dosage_instructions,
            medications (id, name, unit_price, unit),
            consultations (
              id,
              symptoms,
              diagnosis,
              doctor_notes,
              appointments (id, patients (id, full_name))
            )
          `)
          .eq('status', 'pending');

        if (error) throw error;

        // Group prescriptions by consultation
        const groupedByConsultation: { [key: string]: PrescriptionToDispense } = {};

        for (const p of pendingPrescriptions) {
          const consult = p.consultations;
          if (!consult) continue;

          const consultId = consult.id;
          const appointment = consult.appointments;
          const patient = appointment?.patients;

          if (!groupedByConsultation[consultId]) {
            groupedByConsultation[consultId] = {
              consultation_id: consult.id,
              appointment_id: appointment?.id || 'N/A',
              patient_id: patient?.id || 'N/A',
              patient_name: patient?.full_name || 'N/A',
              symptoms: consult.symptoms,
              diagnosis: consult.diagnosis,
              doctor_notes: consult.doctor_notes,
              prescriptions: [],
            };
          }
          
          groupedByConsultation[consultId].prescriptions.push({
            prescription_id: p.id,
            quantity: p.quantity,
            dosage_instructions: p.dosage_instructions,
            medication_id: p.medications.id,
            medication_name: p.medications.name,
            unit_price: p.medications.unit_price || 0,
            medication_unit: p.medications.unit || 'pcs',
            total_price_item: p.quantity * (p.medications.unit_price || 0), // Added missing calculation
          });
        }
        
        const formattedData = Object.values(groupedByConsultation);
        setPrescriptionsToDispense(formattedData);

      } catch (err: any) {
        toast({
            variant: "destructive",
            title: "Gagal memuat data resep",
            description: err.message,
        });
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptionData();
  }, [refreshKey, toast]);

  const handleDispenseSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) return <div>Memuat data pengambilan obat...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Pengambilan Obat</h2>
      <DispenseDrug 
        prescriptions={prescriptionsToDispense} 
        onDispenseSuccess={handleDispenseSuccess}
      />
    </div>
  );
};

export default PengambilanObat;
