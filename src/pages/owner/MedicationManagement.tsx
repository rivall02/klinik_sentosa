import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockManagement from "@/components/pharmacist/StockManagement";
import ViewStock from "@/components/pharmacist/ViewStock";

const MedicationManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Obat-obatan</h1>
        <p className="text-muted-foreground">
          Lihat, tambah, dan kelola stok obat-obatan klinik.
        </p>
      </div>
      <Tabs defaultValue="view-stock">
        <TabsList>
          <TabsTrigger value="view-stock">Lihat Stok Obat</TabsTrigger>
          <TabsTrigger value="manage-stock">Manajemen Stok</TabsTrigger>
        </TabsList>
        <TabsContent value="view-stock">
          <ViewStock />
        </TabsContent>
        <TabsContent value="manage-stock">
          <StockManagement />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MedicationManagement;
