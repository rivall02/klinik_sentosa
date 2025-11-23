import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Users, UserCheck, Star } from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";

const revenueData = [
  { date: "Senin", revenue: 4000000 },
  { date: "Selasa", revenue: 3000000 },
  { date: "Rabu", revenue: 5000000 },
  { date: "Kamis", revenue: 4500000 },
  { date: "Jumat", revenue: 6000000 },
  { date: "Sabtu", revenue: 5500000 },
  { date: "Minggu", revenue: 7000000 },
];

const patientData = [
  { poly: "Umum", count: 45 },
  { poly: "Gigi", count: 20 },
  { poly: "Anak", count: 15 },
  { poly: "THT", count: 10 },
];

const OwnerMainDashboard = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Dashboard Utama Owner</h1>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendapatan Hari Ini</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 12.345.678</div>
            <p className="text-xs text-muted-foreground">+15% dari kemarin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien Bulan Ini</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+5% dari bulan lalu</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dokter Aktif</CardTitle>
            <UserCheck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">dari 7 total dokter</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Kepuasan Pasien</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.8/5.0</div>
            <p className="text-xs text-muted-foreground">Berdasarkan 125 ulasan</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tren Pendapatan (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Line Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Pasien per Poli</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Bar Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerMainDashboard;
