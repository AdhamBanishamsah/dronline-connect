
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, LineChart, PieChart } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string[];
    borderColor?: string;
    borderWidth?: number;
    fill?: boolean;
  }[];
}

interface SummaryStats {
  totalConsultations: number;
  totalPatients: number;
  totalDoctors: number;
  completedConsultations: number;
  pendingConsultations: number;
  inProgressConsultations: number;
}

const ReportsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState<string>("month");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summaryStats, setSummaryStats] = useState<SummaryStats>({
    totalConsultations: 0,
    totalPatients: 0,
    totalDoctors: 0,
    completedConsultations: 0,
    pendingConsultations: 0,
    inProgressConsultations: 0,
  });
  const [statusData, setStatusData] = useState<ChartData>({
    labels: ["Pending", "In Progress", "Completed"],
    datasets: [{
      label: "Consultations",
      data: [0, 0, 0],
      backgroundColor: ["#fbbf24", "#3b82f6", "#10b981"],
    }]
  });
  const [consultationTrendData, setConsultationTrendData] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: "Consultations",
      data: [],
      borderColor: "#0ea5e9",
      fill: false,
    }]
  });

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch all the data we need for reports
      const consultationsPromise = supabase.from("consultations").select("*");
      const patientsPromise = supabase.from("profiles").select("*").eq("role", "patient");
      const doctorsPromise = supabase.from("profiles").select("*").eq("role", "doctor");
      
      const [
        { data: consultationsData, error: consultationsError },
        { data: patientsData, error: patientsError },
        { data: doctorsData, error: doctorsError }
      ] = await Promise.all([consultationsPromise, patientsPromise, doctorsPromise]);
      
      if (consultationsError || patientsError || doctorsError) {
        throw new Error("Error fetching data for reports");
      }
      
      // Process consultations data
      const consultations = consultationsData || [];
      const patients = patientsData || [];
      const doctors = doctorsData || [];
      
      // Filter by time range if needed
      const filteredConsultations = filterByTimeRange(consultations, timeRange);
      
      // Calculate summary stats
      const stats = {
        totalConsultations: consultations.length,
        totalPatients: patients.length,
        totalDoctors: doctors.length,
        completedConsultations: consultations.filter(c => c.status === "completed").length,
        pendingConsultations: consultations.filter(c => c.status === "pending").length,
        inProgressConsultations: consultations.filter(c => c.status === "in_progress").length,
      };
      
      setSummaryStats(stats);
      
      // Update status chart data
      setStatusData({
        labels: ["Pending", "In Progress", "Completed"],
        datasets: [{
          label: "Consultations",
          data: [stats.pendingConsultations, stats.inProgressConsultations, stats.completedConsultations],
          backgroundColor: ["#fbbf24", "#3b82f6", "#10b981"],
        }]
      });
      
      // Update trend chart data
      const trendData = generateTrendData(filteredConsultations, timeRange);
      setConsultationTrendData(trendData);
      
    } catch (error) {
      console.error("Error fetching report data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterByTimeRange = (data: any[], range: string) => {
    const now = new Date();
    let startDate: Date;
    
    switch (range) {
      case "week":
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
        break;
      case "year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
        break;
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    }
    
    return data.filter(item => new Date(item.created_at) >= startDate);
  };

  const generateTrendData = (consultations: any[], range: string): ChartData => {
    // This is a simplified version - in a real app, you'd aggregate by day/week/month
    const labels = [];
    const data = [];
    
    // Generate date labels based on range
    const now = new Date();
    const intervals = range === "week" ? 7 : range === "month" ? 30 : 12;
    const format = range === "year" ? "month" : "day";
    
    // For simplicity, we'll just create dummy data
    for (let i = 0; i < intervals; i++) {
      if (format === "day") {
        const date = new Date(now);
        date.setDate(date.getDate() - (intervals - i - 1));
        labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric" }));
      } else {
        const date = new Date(now);
        date.setMonth(date.getMonth() - (intervals - i - 1));
        labels.push(date.toLocaleDateString("en-US", { month: "short" }));
      }
      
      // Random data for demo purposes
      data.push(Math.floor(Math.random() * 10) + 1);
    }
    
    return {
      labels,
      datasets: [{
        label: "Consultations",
        data,
        borderColor: "#0ea5e9",
        borderWidth: 2,
        fill: false,
      }]
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Analytics Dashboard</h2>
        <div className="w-[180px]">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger>
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Last 7 days</SelectItem>
              <SelectItem value="month">Last 30 days</SelectItem>
              <SelectItem value="year">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {isLoading ? (
          <>
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
          </>
        ) : (
          <>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Consultations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <p className="text-3xl font-bold">{summaryStats.totalConsultations}</p>
                    <p className="text-sm text-muted-foreground">Total</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold text-green-600">{summaryStats.completedConsultations}</span>
                    <span className="text-xs text-muted-foreground">Completed</span>
                    <span className="text-sm font-semibold text-yellow-600">{summaryStats.pendingConsultations}</span>
                    <span className="text-xs text-muted-foreground">Pending</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Patients</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <p className="text-3xl font-bold">{summaryStats.totalPatients}</p>
                    <p className="text-sm text-muted-foreground">Registered</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Doctors</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <div>
                    <p className="text-3xl font-bold">{summaryStats.totalDoctors}</p>
                    <p className="text-sm text-muted-foreground">Active</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      {/* Charts */}
      <Tabs defaultValue="consultations">
        <TabsList>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
          <TabsTrigger value="status">Status Distribution</TabsTrigger>
        </TabsList>
        
        <TabsContent value="consultations" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Consultation Trend</CardTitle>
              <CardDescription>
                Number of consultations over time
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <LineChart
                  data={consultationTrendData}
                  className="h-80"
                  options={{
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="status" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Status Distribution</CardTitle>
              <CardDescription>
                Distribution of consultations by status
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center">
              {isLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <PieChart
                  data={statusData}
                  className="h-80 max-w-md"
                  options={{
                    plugins: {
                      legend: {
                        position: "bottom",
                      }
                    }
                  }}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReportsView;
