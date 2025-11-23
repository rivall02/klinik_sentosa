import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const StaffDashboard = () => {
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent, selectedRole: string) => {
    e.preventDefault();
    
    // In a real app, you'd perform authentication here.
    // For this mock, we'll just redirect based on role.

    switch (selectedRole) {
      case "admin":
        navigate("/admin");
        break;
      case "doctor":
        navigate("/doctor");
        break;
      case "pharmacy":
        navigate("/pharmacist");
        break;
      case "owner":
        navigate("/owner");
        break;
      default:
        // do nothing
        break;
    }
  };

  return (
    <div className="min-h-screen bg-medical-gray py-12">
      <div className="container max-w-md mx-auto px-4">
        <Button
          variant="ghost"
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Kembali ke Beranda
        </Button>

        <Card className="p-8 shadow-card">
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
            Login Staff
          </h1>

          <Tabs defaultValue="admin" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="admin">Admin</TabsTrigger>
              <TabsTrigger value="doctor">Dokter</TabsTrigger>
              <TabsTrigger value="pharmacy">Apotek</TabsTrigger>
              <TabsTrigger value="owner">Owner</TabsTrigger>
            </TabsList>

            <TabsContent value="admin">
              <form onSubmit={(e) => handleLogin(e, "admin")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-username">Username</Label>
                  <Input id="admin-username" placeholder="admin" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="admin-password">Password</Label>
                  <Input
                    id="admin-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Masuk sebagai Admin
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="doctor">
              <form onSubmit={(e) => handleLogin(e, "doctor")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="doctor-username">Username</Label>
                  <Input id="doctor-username" placeholder="dokter" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="doctor-password">Password</Label>
                  <Input
                    id="doctor-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Masuk sebagai Dokter
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="pharmacy">
              <form onSubmit={(e) => handleLogin(e, "pharmacy")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-username">Username</Label>
                  <Input id="pharmacy-username" placeholder="apoteker" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pharmacy-password">Password</Label>
                  <Input
                    id="pharmacy-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Masuk sebagai Apoteker
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="owner">
              <form onSubmit={(e) => handleLogin(e, "owner")} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="owner-username">Username</Label>
                  <Input id="owner-username" placeholder="owner" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="owner-password">Password</Label>
                  <Input
                    id="owner-password"
                    type="password"
                    placeholder="••••••••"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" size="lg">
                  Masuk sebagai Owner
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
};

export default StaffDashboard;
