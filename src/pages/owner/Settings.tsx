import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const Settings = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan Klinik</h1>
        <p className="text-muted-foreground">
          Kelola informasi, jam operasional, dan biaya layanan klinik.
        </p>
      </div>

      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Informasi Klinik</TabsTrigger>
          <TabsTrigger value="hours">Jam Operasional</TabsTrigger>
          <TabsTrigger value="fees">Manajemen Biaya</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum Klinik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic-name">Nama Klinik</Label>
                <Input id="clinic-name" defaultValue="Klinik Sentosa" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" defaultValue="Jl. Sehat No. 123, Jakarta" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" defaultValue="+62 21 1234 5678" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue="kontak@kliniksentosa.com" />
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Jam Operasional</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Hari</TableHead>
                    <TableHead>Jam Buka</TableHead>
                    <TableHead>Jam Tutup</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(day => (
                    <TableRow key={day}>
                      <TableCell>{day}</TableCell>
                      <TableCell><Input type="time" defaultValue="08:00" /></TableCell>
                      <TableCell><Input type="time" defaultValue="20:00" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4">Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="fees">
          <Card>
            <CardHeader>
              <CardTitle>Biaya Konsultasi</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Poli Umum</Label>
                <Input type="number" defaultValue="150000" />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Poli Gigi</Label>
                <Input type="number" defaultValue="200000" />
              </div>
              <div className="grid grid-cols-2 items-center gap-4">
                <Label>Poli Anak</Label>
                <Input type="number" defaultValue="175000" />
              </div>
              <Button>Simpan Perubahan</Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
