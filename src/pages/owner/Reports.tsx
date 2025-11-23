import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { Search, Users, UserPlus, Stethoscope, Clock, Activity } from "lucide-react";

// Mock data for patient activity
const patientActivity = {
  "2025-11-01": 5,
  "2025-11-02": 12,
  "2025-11-03": 25,
  "2025-11-04": 35,
  "2025-11-05": 8,
  "2025-11-08": 18,
  "2025-11-09": 28,
  "2025-11-10": 40,
  "2025-11-15": 2,
  "2025-11-16": 15,
  "2025-11-17": 22,
  "2025-11-18": 31,
};

const Reports = () => {
  const getColorForDate = (date) => {
    const dateString = date.toISOString().split("T")[0];
    const patientCount = patientActivity[dateString] || 0;

    if (patientCount === 0) return "bg-gray-100";
    if (patientCount <= 10) return "bg-blue-100";
    if (patientCount <= 20) return "bg-blue-300";
    if (patientCount <= 30) return "bg-blue-500";
    return "bg-blue-700";
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Laporan Klinik – Dashboard Overview</h1>
          <p className="text-muted-foreground">
            Data kunjungan, aktivitas, dan rangkuman operasional klinik
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-800">
              Total Pasien Hari Ini
            </CardTitle>
            <Users className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-900">125</div>
            <Button variant="link" className="p-0 h-auto text-green-700">
              Detail
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-orange-100 border-orange-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-800">
              Pasien Baru Minggu Ini
            </CardTitle>
            <UserPlus className="h-5 w-5 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-900">32</div>
            <Button variant="link" className="p-0 h-auto text-orange-700">
              Detail
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-800">
              Total Pemeriksaan Bulanan
            </CardTitle>
            <Stethoscope className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-900">1,204</div>
            <Button variant="link" className="p-0 h-auto text-blue-700">
              Detail
            </Button>
          </CardContent>
        </Card>
        <Card className="bg-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-800">
              Rata-rata Waktu Tunggu
            </CardTitle>
            <Clock className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-900">15m</div>
            <Button variant="link" className="p-0 h-auto text-purple-700">
              Detail
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Activity */}
      <div>
        <h2 className="text-xl font-bold mb-4">Statistik Hari Ini (Today’s Activity)</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold">Jam kunjungan tertinggi</p>
              <p className="text-sm text-muted-foreground">10:00 - 11:00 AM</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">Selesai</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold">Dokter paling aktif hari ini</p>
              <p className="text-sm text-muted-foreground">Dr. Siti</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">Selesai</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold">Jumlah pasien per-poli</p>
              <p className="text-sm text-muted-foreground">Umum: 45, Gigi: 20, Anak: 15</p>
            </div>
            <Badge variant="default" className="bg-yellow-100 text-yellow-700">Berlangsung</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold">Pemeriksaan paling sering dilakukan</p>
              <p className="text-sm text-muted-foreground">Pemeriksaan Darah</p>
            </div>
            <Badge variant="default" className="bg-green-100 text-green-700">Selesai</Badge>
          </div>
          <div className="flex items-center justify-between p-4 rounded-lg bg-gray-50">
            <div>
              <p className="font-semibold">Pasien yang membatalkan kunjungan</p>
              <p className="text-sm text-muted-foreground">2 pasien</p>
            </div>
            <Badge variant="secondary">Pending</Badge>
          </div>
        </div>
      </div>

      {/* Calendar Heatmap and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <h2 className="text-xl font-bold mb-4">Kalender Aktivitas Pasien</h2>
          <Card>
            <CardContent className="p-4">
              <DayPicker
                mode="single"
                modifiers={{
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  patientActivity: (date) => {
                    const dateString = date.toISOString().split("T")[0];
                    return patientActivity[dateString] > 0;
                  },
                }}
                modifiersClassNames={{
                  patientActivity: "bg-blue-200",
                }}
                styles={{
                  day: (date) => {
                    return {
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-ignore
                      backgroundColor: getColorForDate(date),
                    };
                  },
                }}
              />
            </CardContent>
          </Card>
          <div className="flex justify-center space-x-4 mt-4 text-sm text-muted-foreground">
            <span><span className="inline-block w-3 h-3 bg-gray-200 rounded-sm mr-1"></span> 0 pasien</span>
            <span><span className="inline-block w-3 h-3 bg-blue-100 rounded-sm mr-1"></span> 1-10</span>
            <span><span className="inline-block w-3 h-3 bg-blue-300 rounded-sm mr-1"></span> 11-20</span>
            <span><span className="inline-block w-3 h-3 bg-blue-500 rounded-sm mr-1"></span> 21-30</span>
            <span><span className="inline-block w-3 h-3 bg-blue-700 rounded-sm mr-1"></span> &gt;30</span>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-4">Jadwal & Acara Akan Datang</h2>
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
              <div className="w-10 h-10 flex items-center justify-center bg-blue-100 rounded-lg">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold">Jadwal Dokter Jaga</p>
                <p className="text-sm text-muted-foreground">Dr. Budi - 09:00 - 12:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
              <div className="w-10 h-10 flex items-center justify-center bg-purple-100 rounded-lg">
                <Stethoscope className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-semibold">Pemeriksaan Khusus</p>
                <p className="text-sm text-muted-foreground">Medical Checkup - 13:00 - 15:00</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 rounded-lg bg-gray-50">
              <div className="w-10 h-10 flex items-center justify-center bg-green-100 rounded-lg">
                <Activity className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold">Acara Klinik</p>
                <p className="text-sm text-muted-foreground">Vaksinasi Gratis - 15:00 - 17:00</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Reports;
