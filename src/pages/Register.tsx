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
  const [availability, setAvailability] = useState({
    senin: "",
    selasa: "",
    rabu: "",
    kamis: "",
    jumat: "",
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
        is_pending_verification: true,
        availability: availability, // Save availability data
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

  const handleUpdatePatientAvailability = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setFormSubmitting(true);
    try {
      const { error } = await supabase
        .from('patients')
        .update({ availability: availability })
        .eq('id', selectedPatient.id);

      if (error) {
        throw error;
      }

      toast({
        title: "Jadwal Pasien Diperbarui!",
        description: `Jadwal untuk ${selectedPatient.full_name} telah diperbarui.`,
      });
      
      setTimeout(() => {
        // Navigate back to patient data or another relevant page
        navigate("/admin/patient-data"); 
      }, 2000);

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Update Gagal",
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
            <div className="space-y-6">
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
                <Button type="button" onClick={() => setStep(3)} className="flex-1" size="lg">
                  Lanjutkan ke Jadwal
                </Button>
              </div>
            </div>
          )}

          {step === 2 && status === 'returning' && (
            // Returning Patient Search UI
            <div className="space-y-6">
              <form onSubmit={handleSearchPatient} className="flex gap-2">
                <Input
                  placeholder="Cari nama pasien..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow"
                />
                <Button type="submit" disabled={searchLoading}>
                  {searchLoading ? 'Mencari...' : <UserSearch className="w-4 h-4" />}
                </Button>
              </form>
              
              {searchResults.length > 0 && !selectedPatient && (
                <div className="space-y-2">
                  <Label>Hasil Pencarian:</Label>
                  {searchResults.map(p => (
                    <Card key={p.id} className="p-4 cursor-pointer hover:bg-muted" onClick={() => {
                      setSelectedPatient(p);
                      // Pre-fill availability form if data exists
                      if (p.availability) {
                        setAvailability(p.availability);
                      } else {
                        // Reset if no availability data
                        setAvailability({ senin: "", selasa: "", rabu: "", kamis: "", jumat: "" });
                      }
                    }}>
                      <p className="font-bold">{p.full_name}</p>
                      <p className="text-sm text-muted-foreground">No. RM: {p.medical_record_number || 'N/A'}</p>
                    </Card>
                  ))}
                </div>
              )}

              {selectedPatient && (
                <Card className="p-4 bg-green-50 border-green-200">
                    <div className="flex items-center gap-4">
                        <CheckCircle2 className="w-8 h-8 text-green-600"/>
                        <div>
                            <p className="font-bold">Pasien Dipilih:</p>
                            <p>{selectedPatient.full_name} (No. RM: {selectedPatient.medical_record_number || 'N/A'})</p>
                        </div>
                         <Button variant="ghost" size="sm" onClick={() => setSelectedPatient(null)} className="ml-auto">Ganti</Button>
                    </div>
                </Card>
              )}

              <div className="flex gap-4">
                <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">
                  Kembali
                </Button>
                <Button type="button" onClick={() => setStep(3)} className="flex-1" size="lg" disabled={!selectedPatient}>
                  Lanjutkan
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Availability for New or Returning Patient */}
          {(step === 3) && (status === 'new' || status === 'returning') && (
            <form onSubmit={status === 'new' ? handleNewPatientSubmit : handleUpdatePatientAvailability} className="space-y-6">
              <div>
                <Label className="text-lg mb-4 block">
                  {status === 'new'
                    ? 'Waktu Luang untuk Konsultasi (Senin-Jumat)'
                    : `Perbarui Waktu Luang untuk ${selectedPatient?.full_name}`
                  }
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
                <Button type="submit" className="flex-1" size="lg" disabled={formSubmitting}>
                  {formSubmitting 
                    ? (status === 'new' ? 'Mendaftarkan...' : 'Memperbarui...')
                    : (status === 'new' ? 'Selesaikan Pendaftaran' : 'Simpan Perubahan Jadwal')
                  }
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
