import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ShieldAlert, UserSearch } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/lib/supabaseClient";

type PatientStatus = "new" | "returning" | "";

const Register = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [status, setStatus] = useState<PatientStatus>("");
  const [formData, setFormData] = useState({
    fullName: "",
    idNumber: "",
    phone: "",
    dateOfBirth: "",
    address: "",
  });
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // State for returning patient flow
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<any | null>(null);

  useEffect(() => {
    const checkAdminRole = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (profile?.role === 'admin') {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    };
    checkAdminRole();
  }, []);

  const handleNewPatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      const { error } = await supabase.from('patients').insert({
        full_name: formData.fullName,
        date_of_birth: formData.dateOfBirth,
        address: formData.address,
        phone_number: formData.phone,
        medical_record_number: formData.idNumber,
        status: 'pending_verification',
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Pendaftaran Pasien Baru Berhasil!",
        description: `Pasien bernama ${formData.fullName} telah ditambahkan.`,
      });
      
      setTimeout(() => {
        navigate("/admin/patient-verification");
      }, 2000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pendaftaran Gagal",
        description: error.message,
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleSearchPatient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setSearchLoading(true);
    setSearchResults([]);
    try {
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .ilike('full_name', `%${searchQuery}%`);
      
      if (error) throw error;

      if (data) {
        setSearchResults(data);
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Pencarian Gagal",
        description: error.message,
      });
    } finally {
      setSearchLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Memeriksa otorisasi...
      </div>
    );
  }

  if (!isAdmin) {
    // Admin verification gate
    return (
      <div className="min-h-screen bg-medical-gray py-12">
        <div className="container max-w-lg mx-auto px-4 text-center">
           <Card className="p-8 shadow-card">
              <ShieldAlert className="w-16 h-16 text-destructive mx-auto mb-4" />
              <h1 className="text-2xl font-bold text-foreground mb-2">
                Akses Ditolak
              </h1>
              <p className="text-muted-foreground mb-6">
                Halaman ini hanya bisa diakses oleh Admin untuk mendaftarkan pasien.
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild>
                  <Link to="/login">Login sebagai Admin</Link>
                </Button>
                <Button variant="outline" onClick={() => navigate("/")}>
                  Kembali ke Beranda
                </Button>
              </div>
           </Card>
        </div>
      </div>
    );
  }

  // If admin is verified, show the registration form
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
              Pendaftaran Pasien (Admin)
            </h1>
            <p className="text-muted-foreground">
              Lengkapi data pasien untuk mendaftarkannya ke dalam sistem.
            </p>
          </div>

          {/* Step 1: Patient Status */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">Pilih Status Pasien</Label>
                <div className="grid md:grid-cols-2 gap-4">
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                      status === "new" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => { setStatus("new"); setSelectedPatient(null); }}
                  >
                    <h3 className="font-semibold text-lg mb-2">Pasien Baru</h3>
                    <p className="text-muted-foreground text-sm">
                      Pasien yang belum pernah terdaftar.
                    </p>
                  </Card>
                  <Card
                    className={`p-6 cursor-pointer transition-all hover:shadow-md ${
                      status === "returning" ? "border-primary bg-primary/5" : "border-border"
                    }`}
                    onClick={() => { setStatus("returning"); setSelectedPatient(null); }}
                  >
                    <h3 className="font-semibold text-lg mb-2">Pasien Lama</h3>
                    <p className="text-muted-foreground text-sm">
                      Cari dan pilih dari data pasien yang ada.
                    </p>
                  </Card>
                </div>
              </div>
              <Button onClick={() => setStep(2)} disabled={!status} className="w-full" size="lg">
                Lanjutkan
              </Button>
            </div>
          )}

          {/* Step 2: Personal Information or Search */}
          {step === 2 && status === 'new' && (
            // New Patient Form
            <form onSubmit={handleNewPatientSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Nama Lengkap *</Label>
                  <Input id="fullName" required value={formData.fullName} onChange={(e) => setFormData({ ...formData, fullName: e.target.value })} placeholder="Nama Pasien" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="idNumber">Nomor Rekam Medis / KTP</Label>
                  <Input id="idNumber" value={formData.idNumber} onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })} placeholder="3201..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <Input id="phone" type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} placeholder="+62 812..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir *</Label>
                  <Input id="dateOfBirth" type="date" required value={formData.dateOfBirth} onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Alamat *</Label>
                  <Input id="address" required value={formData.address} onChange={(e) => setFormData({ ...formData, address: e.target.value })} placeholder="Alamat lengkap pasien" />
                </div>
              </div>
              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Kembali
                </Button>
                <Button type="submit" className="flex-1" size="lg" disabled={formSubmitting}>
                  {formSubmitting ? 'Mendaftarkan...' : 'Daftarkan Pasien Baru'}
                </Button>
              </div>
            </form>
          )}

          {step === 2 && status === 'returning' && (
            // Returning Patient Search UI
            <div className="space-y-6">
              {!selectedPatient ? (
                <>
                  <form onSubmit={handleSearchPatient} className="space-y-4">
                    <Label htmlFor="search-patient" className="text-lg">Cari Pasien Lama</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="search-patient"
                        placeholder="Ketik nama pasien..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                      <Button type="submit" disabled={searchLoading}>
                        {searchLoading ? 'Mencari...' : <UserSearch className="w-5 h-5"/>}
                      </Button>
                    </div>
                  </form>
                  <div className="space-y-2">
                    {searchResults.map(patient => (
                      <Card key={patient.id} className="p-3 flex justify-between items-center cursor-pointer hover:bg-muted" onClick={() => setSelectedPatient(patient)}>
                        <div>
                          <p className="font-semibold">{patient.full_name}</p>
                          <p className="text-sm text-muted-foreground">No. RM: {patient.medical_record_number || 'N/A'}</p>
                        </div>
                        <p className="text-sm">Pilih</p>
                      </Card>
                    ))}
                    {!searchLoading && searchResults.length === 0 && <p className="text-center text-muted-foreground">Tidak ada hasil.</p>}
                  </div>
                </>
              ) : (
                <div className="text-center space-y-4">
                  <h3 className="text-xl font-semibold">Pasien Terpilih:</h3>
                  <p className="text-2xl text-primary">{selectedPatient.full_name}</p>
                  <p className="text-muted-foreground">No. RM: {selectedPatient.medical_record_number || 'N/A'}</p>
                  <div className="flex gap-4 justify-center">
                    <Button onClick={() => alert(`Lanjutkan proses untuk pasien: ${selectedPatient.full_name}`)}>
                      Lanjutkan Pendaftaran Antrian
                    </Button>
                     <Button variant="outline" onClick={() => setSelectedPatient(null)}>
                      Cari Pasien Lain
                    </Button>
                  </div>
                </div>
              )}
               <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Kembali
                </Button>
              </div>
            </div>
          )}

        </Card>
      </div>
    </div>
  );
};

export default Register;
