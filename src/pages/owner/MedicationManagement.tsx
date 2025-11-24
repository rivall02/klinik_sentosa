import StockManagement from "@/components/pharmacist/StockManagement";

const MedicationManagement = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Kelola Obat-obatan</h1>
        <p className="text-muted-foreground">
          Lihat, tambah, dan kelola stok obat-obatan klinik.
        </p>
      </div>
      <StockManagement />
    </div>
  );
};

export default MedicationManagement;
