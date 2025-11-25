import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { supabase } from "@/lib/supabaseClient";

interface DoctorPerformance {
  name: string;
  konsultasi: number;
}

const Analytics = () => {
  const [performanceData, setPerformanceData] = useState<DoctorPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerformanceData = async () => {
      try {
        const { data, error } = await supabase
          .from('appointments')
          .select('profiles(full_name)');
        
        if (error) throw error;

        const counts: { [key: string]: number } = {};
        data.forEach((appt: any) => {
          const doctorName = appt.profiles?.full_name || "Tanpa Dokter";
          counts[doctorName] = (counts[doctorName] || 0) + 1;
        });

        const chartData = Object.keys(counts).map(name => ({
          name: name,
          konsultasi: counts[name],
        }));

        setPerformanceData(chartData);

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPerformanceData();
  }, []);

  if (loading) return <div>Memuat data analitik...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Analitik & Performa</h1>
        <p className="text-muted-foreground">
          Monitor performa dokter berdasarkan jumlah konsultasi.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performa Dokter (Total Konsultasi)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="konsultasi" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Analytics;
