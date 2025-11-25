import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, UserPlus } from "lucide-react";
import { BarChart, CartesianGrid, XAxis, YAxis, Bar, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";
import { supabase } from "@/lib/supabaseClient";
import { startOfToday, endOfToday, subDays, format } from "date-fns";
import { id as a } from "date-fns/locale";

const OwnerMainDashboard = () => {
  const [summary, setSummary] = useState({
    revenueToday: 0,
    patientsToday: 0,
    newPatientsToday: 0,
    revenueTrend: [] as { date: string; revenue: number }[],
    doctorPerformance: [] as { name: string; consultations: number }[],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const todayStart = startOfToday().toISOString();
        const todayEnd = endOfToday().toISOString();
        const sevenDaysAgo = subDays(new Date(), 7).toISOString();

        const [revenueRes, patientsRes, newPatientsRes, trendRes, performanceRes] = await Promise.all([
          supabase.from('transactions').select('total_amount').gte('created_at', todayStart).lte('created_at', todayEnd),
          supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('status', 'selesai').gte('appointment_time', todayStart).lte('appointment_time', todayEnd),
          supabase.from('patients').select('id', { count: 'exact', head: true }).gte('created_at', todayStart).lte('created_at', todayEnd),
          supabase.from('transactions').select('created_at, total_amount').gte('created_at', sevenDaysAgo),
          supabase.from('appointments').select('id, profiles(full_name)'),
        ]);

        if (revenueRes.error) throw revenueRes.error;
        if (patientsRes.error) throw patientsRes.error;
        if (newPatientsRes.error) throw newPatientsRes.error;
        if (trendRes.error) throw trendRes.error;
        if (performanceRes.error) throw performanceRes.error;

        // Process summary cards
        const totalRevenue = revenueRes.data.reduce((sum, t) => sum + t.total_amount, 0);

        // Process revenue trend chart
        const dailyRevenue: { [key: string]: number } = {};
        trendRes.data.forEach(t => {
          const date = format(new Date(t.created_at), 'MMM dd');
          dailyRevenue[date] = (dailyRevenue[date] || 0) + t.total_amount;
        });
        const revenueTrendData = Object.keys(dailyRevenue).map(date => ({ date, revenue: dailyRevenue[date] }));

        // Process doctor performance chart
        const docCounts: { [key: string]: number } = {};
        performanceRes.data.forEach((appt: any) => {
          const docName = appt.profiles?.full_name || "Tanpa Dokter";
          docCounts[docName] = (docCounts[docName] || 0) + 1;
        });
        const doctorPerformanceData = Object.keys(docCounts).map(name => ({ name, consultations: docCounts[name] }));
        
        setSummary({
          revenueToday: totalRevenue,
          patientsToday: patientsRes.count || 0,
          newPatientsToday: newPatientsRes.count || 0,
          revenueTrend: revenueTrendData,
          doctorPerformance: doctorPerformanceData,
        });

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Memuat ringkasan dashboard...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Utama Owner</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle><DollarSign className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">Rp{summary.revenueToday.toLocaleString('id-ID')}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pasien Terlayani Hari Ini</CardTitle><Users className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summary.patientsToday}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"><CardTitle className="text-sm font-medium">Pendaftar Baru Hari Ini</CardTitle><UserPlus className="h-4 w-4 text-muted-foreground" /></CardHeader><CardContent><div className="text-2xl font-bold">{summary.newPatientsToday}</div></CardContent></Card>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Tren Pendapatan (7 Hari Terakhir)</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={summary.revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis tickFormatter={(value) => `Rp${(value/1000000)}Jt`} />
                <Tooltip formatter={(value: number) => [`Rp${value.toLocaleString('id-ID')}`, "Pendapatan"]}/>
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Pendapatan" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Jumlah Pasien per Dokter</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={summary.doctorPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="consultations" name="Jumlah Konsultasi" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerMainDashboard;
