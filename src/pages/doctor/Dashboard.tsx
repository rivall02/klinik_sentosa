import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const todaysQueue = [
  { id: "1", name: "Ahmad Santoso", time: "09:00", status: "Menunggu" },
  { id: "2", name: "Budi Cahyono", time: "09:30", status: "Menunggu" },
  { id: "4", name: "Dewi Putri", time: "10:00", status: "Menunggu" },
];

const seenPatients = [
  { id: "3", name: "Citra Lestari", date: "2024-10-28" },
];

const weeklySchedule = {
  Senin: [{ time: "09:00-12:00", patient: "Ahmad Santoso" }],
  Selasa: [],
  Rabu: [{ time: "13:00-16:00", patient: "Budi Cahyono" }],
  Kamis: [],
  Jumat: [{ time: "09:00-11:00", patient: "Dewi Putri" }],
};

const DoctorDashboardHome = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Dashboard Dokter</h2>

      {/* Today's Queue */}
      <Card>
        <CardHeader>
          <CardTitle>Antrian Pasien Hari Ini</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todaysQueue.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.time}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    <Badge>{patient.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Weekly Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Jadwal Konsultasi Minggu Ini</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {Object.entries(weeklySchedule).map(([day, appointments]) => (
            <div key={day}>
              <h3 className="font-semibold mb-2">{day}</h3>
              <div className="space-y-2">
                {appointments.length > 0 ? (
                  appointments.map((appt, index) => (
                    <Card key={index} className="p-2 bg-muted">
                      <p className="text-sm font-medium">{appt.patient}</p>
                      <p className="text-xs text-muted-foreground">{appt.time}</p>
                    </Card>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">Tidak ada jadwal</p>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Seen Patients */}
      <Card>
        <CardHeader>
          <CardTitle>Pasien yang Sudah Ditangani</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Tanggal Konsultasi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {seenPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DoctorDashboardHome;

