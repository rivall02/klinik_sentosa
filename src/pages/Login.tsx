import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent, expectedRole: string) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (authError) {
        throw authError;
      }
      
      if (authData.user) {
        // Ambil role dari tabel profiles
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', authData.user.id)
          .single();

        if (profileError) {
          throw profileError;
        }

        // Validasi role sesuai dengan tab yang dipilih
        if (profile?.role !== expectedRole) {
          throw new Error(`Login gagal. Akun ini bukan akun ${expectedRole}.`);
        }

        // Arahkan berdasarkan role
        switch (profile?.role) {
          case 'admin':
            navigate('/admin');
            break;
          case 'doctor':
            navigate('/doctor');
            break;
          case 'pharmacist':
            navigate('/pharmacist');
            break;
          case 'owner':
            navigate('/owner');
            break;
          default:
            setError('Role tidak ditemukan untuk pengguna ini.');
            await supabase.auth.signOut();
            break;
        }
      }

    } catch (error: any) {
      setError(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  const renderLoginForm = (roleName: string, roleValue: string) => (
    <form onSubmit={(e) => handleLogin(e, roleValue)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor={`${roleValue}-email`}>Email</Label>
        <Input 
          id={`${roleValue}-email`} 
          type="email"
          placeholder="email@example.com" 
          required 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor={`${roleValue}-password`}>Password</Label>
        <Input
          id={`${roleValue}-password`}
          type="password"
          placeholder="••••••••"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" className="w-full" size="lg" disabled={loading}>
        {loading ? 'Memuat...' : `Masuk sebagai ${roleName}`}
      </Button>
    </form>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container max-w-md mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <Card className="p-8 shadow-lg">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
            Login Staff
          </h1>

          <Tabs defaultValue="admin" className="w-full" onValueChange={() => setError(null)}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="doctor">Dokter</TabsTrigger>
              <TabsTrigger value="pharmacist">Apotek</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">{renderLoginForm("Admin", "admin")}</TabsContent>
            <TabsContent value="doctor">{renderLoginForm("Dokter", "doctor")}</TabsContent>
            <TabsContent value="pharmacist">{renderLoginForm("Apoteker", "pharmacist")}</TabsContent>
            <TabsContent value="owner">{renderLoginForm("Owner", "owner")}</TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default Login;
