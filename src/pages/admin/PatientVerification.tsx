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

const mockPatients = [
  {
    id: "1",
    name: "Ahmad Santoso",
    registrationDate: "2024-10-28",
    status: "Pending",
  },
  {
    id: "2",
    name: "Budi Cahyono",
    registrationDate: "2024-10-28",
    status: "Pending",
  },
  {
    id: "3",
    name: "Citra Lestari",
    registrationDate: "2024-10-27",
    status: "Revision Requested",
  },
];

const PatientVerification = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Verifikasi Pasien</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama Pasien</TableHead>
            <TableHead>Tanggal Pendaftaran</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockPatients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.name}</TableCell>
              <TableCell>{patient.registrationDate}</TableCell>
              <TableCell>{patient.status}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                    <DropdownMenuItem>Setujui</DropdownMenuItem>
                    <DropdownMenuItem>Tolak</DropdownMenuItem>
                    <DropdownMenuItem>Minta Revisi</DropdownMenuItem>
                    <DropdownMenuItem>Aktifkan/Nonaktifkan</DropdownMenuItem>
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

export default PatientVerification;

