import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Report {
  name: string;
  date: string;
}

interface ReportDetailsProps {
  report: Report;
  onClose: () => void;
}

const ReportDetails = ({ report, onClose }: ReportDetailsProps) => {
  return (
    <Card className="mt-8">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{report.name}</CardTitle>
        <Button variant="ghost" size="icon" onClick={onClose}>
          X
        </Button>
      </CardHeader>
      <CardContent>
        <p>
          <strong>Tanggal:</strong> {report.date}
        </p>
        <div className="mt-4">
          <h4 className="font-semibold">Isi Laporan</h4>
          <p>
            Ini adalah isi dari laporan. Untuk saat ini, kami menggunakan data
            dummy.
          </p>
          {/* You can add more detailed report content here */}
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDetails;
