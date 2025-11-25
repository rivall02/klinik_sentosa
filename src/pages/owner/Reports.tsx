import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/lib/supabaseClient";
import { Stethoscope, Pill } from "lucide-react";

interface TopMedication {
  name: string;
  count: number;
}

const Reports = () => {
  const [totalConsultations, setTotalConsultations] = useState(0);
  const [topMedications, setTopMedications] = useState<TopMedication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReportData = async () => {
      try {
        const [consultationRes, prescriptionRes] = await Promise.all([
          supabase.from('consultations').select('id', { count: 'exact', head: true }),
          supabase.from('prescriptions').select('medications(name)'),
        ]);

        if (consultationRes.error) throw consultationRes.error;
        if (prescriptionRes.error) throw prescriptionRes.error;
        
        setTotalConsultations(consultationRes.count || 0);

        const medCounts: { [key: string]: number } = {};
        prescriptionRes.data.forEach((p: any) => {
          if (p.medications) {
            const medName = p.medications.name;
            medCounts[medName] = (medCounts[medName] || 0) + 1;
          }
        });

        const sortedMeds = Object.entries(medCounts)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 10); // Get top 10

        setTopMedications(sortedMeds);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchReportData();
  }, []);

  if (loading) return <div>Memuat data laporan...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Laporan Aktivitas Klinik</h1>
        <p className="text-muted-foreground">
          Ringkasan aktivitas konsultasi dan peresepan obat.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Konsultasi</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalConsultations}</div>
            <p className="text-xs text-muted-foreground">Total sesi konsultasi yang tercatat</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><Pill className="h-5 w-5"/> Obat Paling Sering Diresepkan</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No.</TableHead>
                <TableHead>Nama Obat</TableHead>
                <TableHead className="text-right">Jumlah Diresepkan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topMedications.map((med, index) => (
                <TableRow key={med.name}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{med.name}</TableCell>
                  <TableCell className="text-right">{med.count} kali</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Reports;
