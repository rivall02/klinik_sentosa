import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type PatientStatus = "new" | "returning" | "";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<PatientStatus>("");
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    address: "",
  });

  const [availability, setAvailability] = useState({
    senin: "",
    selasa: "",
    rabu: "",
    kamis: "",
    jumat: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // TODO: Send complete form data including availability to the backend
    console.log({ ...formData, availability });

    toast({
      title: "Pendaftaran Berhasil!",
      description: "Nomor antrian Anda adalah #A123. Silakan cek status antrian.",
    });
    
    setTimeout(() => {
      navigate("/queue");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-3xl mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <Card className="p-8 shadow-card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Pendaftaran Pasien
            </h1>
            <p className="text-muted-foreground">
              Lengkapi proses pendaftaran untuk bergabung dalam antrian
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                  {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : "1"}
                </div>
                <span className="font-medium">Status</span>
              </div>
              <div className={`w-16 h-0.5 ${step > 1 ? "bg-primary" : "bg-muted"}`} />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                  {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : "2"}
                </div>
                <span className="font-medium">Detail</span>
              </div>
              <div className={`w-16 h-0.5 ${step > 2 ? "bg-primary" : "bg-muted"}`} />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 3 ? "border-primary bg-primary text-primary-foreground" : "border-muted"}`}>
                  3
                </div>
                <span className="font-medium">Jadwal</span>
              </div>
            </div>
          </div>

          {/* Step 1: Patient Status */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">Pilih Status Anda</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                      status === "new"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setStatus("new")}
                  >
                    <h3 className="font-semibold text-lg mb-2">Pasien Baru</h3>
                    <p className="text-muted-foreground text-sm">
                      Pertama kali berkunjung ke klinik ini
                    </p>
                  </Card>
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                      status === "returning"
                        ? "border-primary bg-primary/5"
                        : "border-border"
                    }`}
                    onClick={() => setStatus("returning")}
                  >
                    <h3 className="font-semibold text-lg mb-2">Pasien Lama</h3>
                    <p className="text-muted-foreground text-sm">
                      Sudah terdaftar sebelumnya
                    </p>
                  </Card>
                </div>
              </div>
              <Button
                onClick={() => setStep(2)}
                disabled={!status}
                className="w-full"
                size="lg"
              >
                Lanjutkan
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input
                    id="fullName"
                    required
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    placeholder="Ahmad Santoso"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">Nomor KTP *</Label>
                  <Input
                    id="idNumber"
                    required
                    value={formData.idNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, idNumber: e.target.value })
                    }
                    placeholder="3201234567890123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="+62 812 3456 7890"
                  />
                </div>
                {status === "new" && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        placeholder="ahmad@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
                      <Input
                        id="dateOfBirth"
                        type="date"
                        required
                        value={formData.dateOfBirth}
                        onChange={(e) =>
                          setFormData({ ...formData, dateOfBirth: e.target.value })
                        }
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="address">Alamat *</Label>
                      <Input
                        id="address"
                        required
                        value={formData.address}
                        onChange={(e) =>
                          setFormData({ ...formData, address: e.target.value })
                        }
                        placeholder="Alamat lengkap"
                      />
                    </div>
                  </>
                )}
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1"
                  size="lg"
                >
                  Lanjutkan
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Availability */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">
                  Waktu Luang untuk Konsultasi (Senin-Jumat)
                </Label>
                <div className="space-y-4">
                  {Object.keys(availability).map((day) => (
                    <div key={day} className="grid grid-cols-3 items-center gap-4">
                      <Label htmlFor={day} className="capitalize">
                        {day}
                      </Label>
                      <Input
                        id={day}
                        value={availability[day as keyof typeof availability]}
                        onChange={(e) =>
                          setAvailability({
                            ...availability,
                            [day]: e.target.value,
                          })
                        }
                        placeholder="e.g., 09:00–12:00 atau Tidak Tersedia"
                        className="col-span-2"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(2)}
                  className="flex-1"
                >
                  Kembali
                </Button>
                <Button type="submit" className="flex-1" size="lg">
                  Selesaikan Pendaftaran
                </Button>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Register;
