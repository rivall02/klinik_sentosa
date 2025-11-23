import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Phone, UserX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const DoctorQueue = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const patients = [
    { id: "1", number: "A102", name: "Jane Smith", status: "waiting" },
    { id: "2", number: "A103", name: "Mike Johnson", status: "waiting" },
    { id: "3", number: "A104", name: "Sarah Williams", status: "waiting" },
  ];

  const handleCallPatient = (patientId: string) => {
    toast({
      title: "Pasien Dipanggil",
      description: "Notifikasi terkirim ke ruang tunggu",
    });
    navigate(`/doctor/consultation/${patientId}`);
  };

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-2xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/doctor")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Dashboard
        </Button>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">
            Antrian Pasien Konsultasi
          </h2>
          <div className="space-y-3">
            {patients.map((patient) => (
              <div
                key={patient.id}
                className="p-4 rounded-lg border bg-card border-border"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <div className="font-semibold text-foreground">
                      {patient.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Antrian: {patient.number}
                    </div>
                  </div>
                  <Badge variant="secondary">menunggu</Badge>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCallPatient(patient.id)}
                    className="flex-1"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Panggil
                  </Button>
                  <Button size="sm" variant="outline">
                    <UserX className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DoctorQueue;
