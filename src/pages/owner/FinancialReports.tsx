import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Calendar as CalendarIcon, Download } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { id } from "date-fns/locale";

const mockTransactions = [
  { date: "2025-11-23", description: "Pembayaran konsultasi", category: "Pendapatan", income: 250000, expense: 0 },
  { date: "2025-11-23", description: "Pembelian obat", category: "Pengeluaran", income: 0, expense: 1500000 },
  { date: "2025-11-22", description: "Pembayaran konsultasi", category: "Pendapatan", income: 300000, expense: 0 },
  { date: "2025-11-21", description: "Gaji staff", category: "Pengeluaran", income: 0, expense: 5000000 },
];

const FinancialReports = () => {
  const [dateRange, setDateRange] = useState({
    from: new Date(2025, 10, 1),
    to: new Date(2025, 10, 23),
  });

  const totalIncome = mockTransactions.reduce((acc, t) => acc + t.income, 0);
  const totalExpense = mockTransactions.reduce((acc, t) => acc + t.expense, 0);
  const netProfit = totalIncome - totalExpense;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">Laporan Keuangan</h1>
          <p className="text-muted-foreground">
            Lacak pemasukan, pengeluaran, dan profitabilitas klinik.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, "d LLL y", { locale: id })} -{" "}
                      {format(dateRange.to, "d LLL y", { locale: id })}
                    </>
                  ) : (
                    format(dateRange.from, "d LLL y", { locale: id })
                  )
                ) : (
                  <span>Pilih rentang tanggal</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          <Button>
            <Download className="w-4 h-4 mr-2" />
            Unduh Laporan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Pendapatan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              Rp{totalIncome.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              Rp{totalExpense.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Laba Bersih</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp{netProfit.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detail Transaksi</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead className="text-right">Pemasukan</TableHead>
                <TableHead className="text-right">Pengeluaran</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTransactions.map((t, i) => (
                <TableRow key={i}>
                  <TableCell>{t.date}</TableCell>
                  <TableCell>{t.description}</TableCell>
                  <TableCell>{t.category}</TableCell>
                  <TableCell className="text-right text-green-600">
                    {t.income > 0 ? `Rp${t.income.toLocaleString("id-ID")}` : "-"}
                  </TableCell>
                  <TableCell className="text-right text-red-600">
                    {t.expense > 0 ? `Rp${t.expense.toLocaleString("id-ID")}` : "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialReports;
