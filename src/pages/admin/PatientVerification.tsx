import { useState, useEffect } from "react";
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
import { supabase } from "@/lib/supabaseClient";

const PatientVerification = () => {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const { data, error } = await supabase
          .from("patients")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          throw error;
        }
        setPatients(data);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  if (loading) {
    return <div>Memuat data pasien...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

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
          {patients.map((patient) => (
            <TableRow key={patient.id}>
              <TableCell>{patient.full_name}</TableCell>
              <TableCell>{new Date(patient.created_at).toLocaleDateString()}</TableCell>
              <TableCell>Pending</TableCell> {/* Status masih hardcoded */}
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
