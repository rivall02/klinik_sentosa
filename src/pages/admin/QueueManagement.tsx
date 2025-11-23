import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const mockQueue = [
  {
    id: "1",
    queueNumber: "A123",
    name: "Ahmad Santoso",
    doctor: "Dr. Budi",
    status: "Menunggu",
  },
  {
    id: "2",
    queueNumber: "A124",
    name: "Budi Cahyono",
    doctor: "Dr. Budi",
    status: "Dipanggil",
  },
  {
    id: "3",
    queueNumber: "B101",
    name: "Citra Lestari",
    doctor: "Dr. Ani",
    status: "Selesai",
  },
  {
    id: "4",
    queueNumber: "A125",
    name: "Dewi Putri",
    doctor: "Dr. Budi",
    status: "Menunggu",
  },
];

const getStatusVariant = (status: string) => {
  switch (status) {
    case "Menunggu":
      return "secondary";
    case "Dipanggil":
      return "default";
    case "Selesai":
      return "outline";
    default:
      return "secondary";
  }
};

const QueueManagement = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Manajemen Antrian Harian</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>No. Antrian</TableHead>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Dokter</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockQueue.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.queueNumber}</TableCell>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.doctor}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(patient.status)}>
                  {patient.status}
                </Badge>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Prioritaskan</DropdownMenuItem>
                    <DropdownMenuItem>Pindahkan Jadwal</DropdownMenuItem>
                    <DropdownMenuItem>Tandai "Dipanggil"</DropdownMenuItem>
                    <DropdownMenuItem>Tandai "Selesai"</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default QueueManagement;

