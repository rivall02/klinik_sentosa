import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users } from "lucide-react";

const Queue = () => {
  const navigate = useNavigate();

  const queueData = [
    { number: "A101", name: "John Doe", status: "in-progress", time: "10:30" },
    { number: "A102", name: "Jane Smith", status: "waiting", time: "10:35" },
    { number: "A103", name: "Mike Johnson", status: "waiting", time: "10:40" },
    { number: "A104", name: "Sarah Williams", status: "waiting", time: "10:45" },
    { number: "A105", name: "Tom Brown", status: "waiting", time: "10:50" },
  ];

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-4xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <Card className="p-8 shadow-card mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Antrian Langsung
              </h1>
              <p className="text-muted-foreground">
                Status antrian pasien secara real-time
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">5</span>
                </div>
                <p className="text-sm text-muted-foreground">Dalam Antrian</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">~15</span>
                </div>
                <p className="text-sm text-muted-foreground">Rata-rata Tunggu (menit)</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            {queueData.map((patient) => (
              <div
                key={patient.number}
                className={`p-4 rounded-lg border ${
                  patient.status === "in-progress"
                    ? "bg-primary/5 border-primary"
                    : "bg-card border-border"
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">
                        {patient.number}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {patient.time}
                      </div>
                    </div>
                    <div>
                      <div className="font-semibold text-foreground">
                        {patient.name}
                      </div>
                    </div>
                  </div>
                  <Badge
                    variant={patient.status === "in-progress" ? "default" : "secondary"}
                  >
                    {patient.status === "in-progress" ? "Sedang Dilayani" : "Menunggu"}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center">
            <h3 className="font-semibold text-foreground mb-2">
              Pindai Kode QR untuk Update
            </h3>
            <p className="text-sm text-muted-foreground">
              Dapatkan notifikasi real-time saat hampir giliran Anda
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Queue;
