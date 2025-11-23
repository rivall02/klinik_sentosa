import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Users, Calendar, FileText } from "lucide-react";
import heroImage from "@/assets/hero-clinic.jpg";

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: ClipboardList,
      title: "Pendaftaran Mudah",
      description: "Proses pendaftaran pasien yang cepat dan sederhana dengan panduan langkah demi langkah",
    },
    {
      icon: Users,
      title: "Antrian Real-Time",
      description: "Pemantauan antrian secara langsung yang dapat diakses melalui kode QR",
    },
    {
      icon: Calendar,
      title: "Penjadwalan Cerdas",
      description: "Sistem manajemen antrian dan penjadwalan ulang otomatis",
    },
    {
      icon: FileText,
      title: "Resep Digital",
      description: "Alur resep yang terintegrasi dari dokter ke apotek",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">Klinik Sentosa</h1>
          <nav className="flex gap-4">
            <Button variant="outline" onClick={() => navigate("/staff")}>
              Login Staff
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-medical-light to-background" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-5xl font-bold text-foreground leading-tight">
                Layanan Kesehatan Modern
                <span className="text-primary block">Manajemen Antrian Digital</span>
              </h2>
              <p className="text-xl text-muted-foreground">
                Sistem antrian cerdas untuk memudahkan operasional klinik Anda.
                Dari pendaftaran hingga resep, semuanya terintegrasi dengan sempurna.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate("/register")}>
                  Daftar Sebagai Pasien
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/queue")}>
                  Lihat Antrian
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden shadow-card">
                <img
                  src={heroImage}
                  alt="Modern medical clinic"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-medical-gray">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-foreground mb-4">
              Mengapa Memilih Klinik Sentosa?
            </h3>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sistem komprehensif kami membuat manajemen layanan kesehatan menjadi
              sederhana dan efisien untuk pasien maupun staff.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 bg-card hover:shadow-card transition-all duration-300 border-border"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h4>
                <p className="text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>



      {/* Footer */}
      <footer className="border-t border-border py-8 bg-card">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2024 Klinik Sentosa. Sistem Manajemen Layanan Kesehatan Modern.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
