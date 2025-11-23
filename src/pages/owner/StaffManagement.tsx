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

const mockStaff = [
  { id: "1", name: "Dr. Budi", role: "Dokter", status: "Aktif" },
  { id: "2", name: "Ani", role: "Admin", status: "Aktif" },
  { id: "3", name: "Siti", role: "Apoteker", status: "Nonaktif" },
];

const StaffManagement = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Manajemen Staff</h2>
        <Button>Tambah Staff Baru</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mockStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell>{staff.name}</TableCell>
              <TableCell>
                <Badge>{staff.role}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={staff.status === "Aktif" ? "default" : "secondary"}>
                  {staff.status}
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
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                    <DropdownMenuItem>Reset Password</DropdownMenuItem>
                    <DropdownMenuItem>Hapus</DropdownMenuItem>
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

export default StaffManagement;
