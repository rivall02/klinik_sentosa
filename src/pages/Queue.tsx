import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Skeleton } from "@/components/ui/skeleton";

interface QueueItem {
  queue_number: number;
  status: 'menunggu' | 'sedang_konsultasi'; // Updated possible statuses based on user feedback
  patient_name: string;
}

const Queue = () => {
  const navigate = useNavigate();
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQueue = async () => {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .rpc('get_today_appointments'); // Call the RPC function

      if (error) {
        console.error("Error fetching queue:", error);
      } else if (data) {
        setQueue(data as QueueItem[]);
      }
      setIsLoading(false);
    };

    fetchQueue();

    const channel = supabase
      .channel('realtime-appointments')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        (payload) => {
          console.log('Change received!', payload);
          fetchQueue();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const dayName = new Date().toLocaleDateString('id-ID', { weekday: 'long' });
  const inProgressPatient = queue.find(p => p.status === 'sedang_konsultasi');
  const waitingPatients = queue.filter(p => p.status === 'menunggu');

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Antrian Langsung
              </h1>
              <p className="text-muted-foreground">
                Status antrian pasien untuk hari {dayName}
              </p>
            </div>
            <div className="flex gap-4">
              <div className="text-center">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Users className="w-5 h-5" />
                  <span className="text-2xl font-bold">{queue.length}</span>
                </div>
                <p className="text-sm text-muted-foreground">Dalam Antrian</p>
              </div>
              <div className="text-center">
                <div className="flex items-center gap-2 text-primary mb-1">
                  <Clock className="w-5 h-5" />
                  <span className="text-2xl font-bold">~{waitingPatients.length * 5}</span>
                </div>
                <p className="text-sm text-muted-foreground">Estimasi Tunggu (menit)</p>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-3">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : queue.length === 0 ? (
             <div className="text-center py-12">
                <p className="text-muted-foreground">Belum ada antrian untuk hari ini.</p>
              </div>
          ) : (
            <div className="space-y-4">
              {inProgressPatient && (
                 <div className="p-4 rounded-lg border bg-primary/5 border-primary animate-pulse">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-4">
                       <div className="text-2xl font-bold text-primary">{inProgressPatient.queue_number}</div>
                       <div className="font-semibold text-foreground">{inProgressPatient.patient_name ?? 'Pasien tidak ditemukan'}</div>
                     </div>
                     <Badge variant="default">Sedang Konsultasi</Badge>
                   </div>
                 </div>
              )}
               <div className="space-y-3">
                {waitingPatients.map((patient) => (
                  <div
                    key={patient.queue_number}
                    className="p-4 rounded-lg border bg-card border-border"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-2xl font-bold text-muted-foreground">{patient.queue_number}</div>
                        <div className="font-semibold text-foreground">{patient.patient_name ?? 'Pasien tidak ditemukan'}</div>
                      </div>
                      <Badge variant="secondary">Menunggu</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
