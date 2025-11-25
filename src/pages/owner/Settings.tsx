import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState } from "react";

// Data Interfaces
interface ClinicInfo {
  clinic_name: string;
  address: string;
  phone: string;
  email: string;
}

interface OperatingHour {
  day: string;
  open: string;
  close: string;
  is_closed: boolean;
}

const Settings = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // State for each tab
  const [clinicInfo, setClinicInfo] = useState<ClinicInfo>({
    clinic_name: "",
    address: "",
    phone: "",
    email: "",
  });
  const [operatingHours, setOperatingHours] = useState<OperatingHour[]>([]);

  // Fetch initial data
  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("settings")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        toast({
          title: "Error",
          description: "Gagal memuat pengaturan. Memuat data default.",
          variant: "destructive",
        });
        console.error("Fetch settings error:", error);
      } else if (data) {
        setClinicInfo({
          clinic_name: data.clinic_name || "",
          address: data.address || "",
          phone: data.phone || "",
          email: data.email || "",
        });
        setOperatingHours(data.operating_hours || []);
      }
      setIsLoading(false);
    };

    fetchSettings();
  }, [toast]);

  // Handlers for state changes
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setClinicInfo((prev) => ({ ...prev, [id]: value }));
  };

  const handleHourChange = (index: number, field: keyof OperatingHour, value: any) => {
    const updatedHours = [...operatingHours];
    updatedHours[index] = { ...updatedHours[index], [field]: value };
    setOperatingHours(updatedHours);
  };
  
  // Handlers for saving data
  const handleSave = async (field: string, data: any) => {
    setIsSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({ [field]: data })
      .eq("id", 1);

    if (error) {
      toast({
        title: "Gagal Menyimpan",
        description: `Perubahan pada ${field} gagal disimpan.`,
        variant: "destructive",
      });
      console.error(`Save ${field} error:`, error);
    } else {
      toast({
        title: "Berhasil",
        description: `Perubahan pada ${field} telah disimpan.`,
      });
    }
    setIsSaving(false);
  };
  
  const handleSaveInfo = async () => {
    setIsSaving(true);
    const { error } = await supabase
      .from("settings")
      .update({ ...clinicInfo })
      .eq("id", 1);

    if (error) {
      toast({
        title: "Gagal Menyimpan",
        description: "Informasi klinik gagal disimpan.",
        variant: "destructive",
      });
      console.error("Save info error:", error);
    } else {
      toast({
        title: "Berhasil",
        description: "Informasi klinik telah disimpan.",
      });
    }
    setIsSaving(false);
  };


  if (isLoading) {
    return <p>Memuat pengaturan...</p>;
  }

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
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Umum Klinik</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="clinic_name">Nama Klinik</Label>
                <Input id="clinic_name" value={clinicInfo.clinic_name} onChange={handleInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input id="address" value={clinicInfo.address} onChange={handleInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Telepon</Label>
                <Input id="phone" value={clinicInfo.phone} onChange={handleInfoChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={clinicInfo.email} onChange={handleInfoChange} />
              </div>
              <Button onClick={handleSaveInfo} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
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
                    <TableHead>Tutup</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {operatingHours.map((hour, index) => (
                    <TableRow key={hour.day}>
                      <TableCell>{hour.day}</TableCell>
                      <TableCell>
                        <Input type="time" value={hour.open} onChange={(e) => handleHourChange(index, 'open', e.target.value)} disabled={hour.is_closed} />
                      </TableCell>
                      <TableCell>
                        <Input type="time" value={hour.close} onChange={(e) => handleHourChange(index, 'close', e.target.value)} disabled={hour.is_closed} />
                      </TableCell>
                      <TableCell>
                        <Switch checked={hour.is_closed} onCheckedChange={(checked) => handleHourChange(index, 'is_closed', checked)} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Button className="mt-4" onClick={() => handleSave('operating_hours', operatingHours)} disabled={isSaving}>
                {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
