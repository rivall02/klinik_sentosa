import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BarChart, LineChart, CartesianGrid, XAxis, YAxis, Bar, Line } from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart";

const doctorPerformanceData = [
  { name: "Dr. Budi", consultations: 120 },
  { name: "Dr. Siti", consultations: 150 },
  { name: "Dr. Agus", consultations: 100 },
];

const patientTrendData = [
  { month: "Jan", count: 1200 },
  { month: "Feb", count: 1300 },
  { month: "Mar", count: 1100 },
  { month: "Apr", count: 1400 },
  { month: "Mei", count: 1500 },
  { month: "Jun", count: 1450 },
];

const Analytics = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Analitik & Performa</h1>
          <p className="text-muted-foreground">
            Monitor performa dokter dan tren kunjungan pasien.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Dokter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Dokter</SelectItem>
              <SelectItem value="budi">Dr. Budi</SelectItem>
              <SelectItem value="siti">Dr. Siti</SelectItem>
              <SelectItem value="agus">Dr. Agus</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Pilih Periode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="monthly">Bulanan</SelectItem>
              <SelectItem value="weekly">Mingguan</SelectItem>
              <SelectItem value="daily">Harian</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Performance Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Rata-rata Waktu Konsultasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 menit</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Jumlah Pasien per Dokter</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25 pasien/hari</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tingkat Pembatalan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5%</div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Performa Dokter (Jumlah Konsultasi)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Bar Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Tren Kunjungan Pasien</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 w-full flex items-center justify-center bg-gray-100 rounded-md">
              <p className="text-muted-foreground">Line Chart Placeholder</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;
