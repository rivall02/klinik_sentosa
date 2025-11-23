import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const unscheduledPatients = [
  {
    id: "1",
    name: "Eka Putri",
    availability: {
      Senin: "09:00–12:00",
      Selasa: "Tidak Tersedia",
      Rabu: "13:00–16:00",
      Kamis: "09:00–12:00",
      Jumat: "Tidak Tersedia",
    },
  },
  {
    id: "2",
    name: "Fajar Wicaksono",
    availability: {
      Senin: "Tidak Tersedia",
      Selasa: "10:00–14:00",
      Rabu: "Tidak Tersedia",
      Kamis: "10:00–14:00",
      Jumat: "13:00–17:00",
    },
  },
];

const weeklySchedule = {
  Senin: [{ time: "09:00-12:00", patient: "Ahmad Santoso" }],
  Selasa: [],
  Rabu: [{ time: "13:00-16:00", patient: "Budi Cahyono" }],
  Kamis: [],
  Jumat: [{ time: "09:00-11:00", patient: "Dewi Putri" }],
};

const Schedule = () => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Manajemen Jadwal Pasien</h2>

      {/* Unscheduled Patients */}
      <Card>
        <CardHeader>
          <CardTitle>Pasien Belum Terjadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama Pasien</TableHead>
                <TableHead>Waktu Luang</TableHead>
                <TableHead>Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {unscheduledPatients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>
                    <ul className="text-sm">
                      {Object.entries(patient.availability).map(([day, time]) => (
                        <li key={day}>
                          <span className="font-semibold">{day}:</span> {time}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>Jadwalkan</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Jadwalkan {patient.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="space-y-2">
                            <Label htmlFor="date">Tanggal</Label>
                            <Input id="date" type="date" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="time">Waktu</Label>
                            <Input id="time" type="time" />
                          </div>
                          <Button className="w-full">Simpan Jadwal</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
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
    </div>
  );
};

export default Schedule;

