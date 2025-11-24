import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StockManagement from "@/components/pharmacist/StockManagement";
import PengambilanObat from "@/pages/pharmacist/PengambilanObat";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const PharmacistDashboard = () => {
  return (
    <div className="container mx-auto p-8">
      <Button asChild className="mb-4">
        <Link to="/">Kembali</Link>
      </Button>
      <h1 className="text-3xl font-bold mb-8">Apoteker Dashboard</h1>
      <Tabs defaultValue="manage-stock">
        <TabsList>
          <TabsTrigger value="manage-stock">Manajemen Stok Obat</TabsTrigger>
          <TabsTrigger value="dispense-drug">Pengambilan Obat</TabsTrigger>
        </TabsList>
        <TabsContent value="manage-stock">
          <StockManagement />
        </TabsContent>
        <TabsContent value="dispense-drug">
          <PengambilanObat />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PharmacistDashboard;
