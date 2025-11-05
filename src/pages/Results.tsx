import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Activity, BookOpen } from "lucide-react";
import { ECGVisualization } from "@/components/ECGVisualization";
import { MetricsPanel } from "@/components/MetricsPanel";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import type { ECGAnalysis, AnalysisResponse } from "@/types/analysis";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const file = location.state?.file;
  const [analysis, setAnalysis] = useState<ECGAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Ensure user is present before analysis
  useEffect(() => {
    if (!file) {
      navigate("/");
      return;
    }
    if (!user) return;
    setLoading(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64Data = reader.result as string;
      try {
        // Call edge function
        const { data, error } = await supabase.functions.invoke("analyze-ecg", {
          body: {
            fileData: base64Data,
            fileName: file.name,
            userId: user.id,
          },
        });
        if (error) {
          console.error("Error analyzing ECG:", error);
          toast({
            title: "Analysis Error",
            description:
              error.message || "Failed to analyze ECG. Please try again.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }
        if (data?.analysis) {
          setAnalysis(data.analysis);
          toast({
            title: "Analysis Complete",
            description: "Your ECG has been analyzed successfully.",
          });
        } else {
          toast({
            title: "Analysis Error",
            description: "No analysis data returned.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error in analyzeECG:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "An unexpected error occurred.",
          variant: "destructive",
        });
      }
      setLoading(false);
    };
    reader.onerror = () => {
      toast({
        title: "File Read Error",
        description: "Failed to read the file. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    };
    reader.readAsDataURL(file);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, navigate, user]);

  if (!file) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">ECG Analysis Results</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left: ECG Visualization and Heatmap */}
          <div className="space-y-6">
            <Card className="p-6 shadow-lg">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-primary">
                  ECG Waveform & Heatmap
                </h2>
                <span className="text-xs text-muted-foreground">
                  {file.name}
                </span>
              </div>
              <div className="bg-card rounded-lg overflow-hidden border">
                <ECGVisualization
                  file={file}
                  heatmapZones={
                    analysis?.heatmapZones
                      ? analysis.heatmapZones.map((zone) => ({
                          x: zone.startTime, // Map appropriately to x
                          y: 0, // Default y, adjust if needed
                          width: zone.endTime - zone.startTime,
                          height: 50, // Default height, adjust as needed
                          intensity: zone.severity,
                        }))
                      : []
                  }
                />
              </div>
            </Card>
          </div>

          {/* Right: Metrics and Predictions */}
          <div className="flex flex-col gap-4">
            {/* Heart Rate Card */}
            <Card className="p-4 flex flex-col gap-1 shadow-card-subtle">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block bg-green-100 p-2 rounded-full">
                  <svg width="20" height="20" fill="none">
                    <path
                      d="M10 17s-6-4.35-6-8.5A4.5 4.5 0 0110 4a4.5 4.5 0 016 4.5C16 12.65 10 17 10 17z"
                      stroke="#22C55E"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-gray-700">Heart Rate</span>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {analysis?.heartRate ?? 72} BPM
              </span>
              <span className="text-sm text-gray-500">
                {(analysis?.heartRate ?? 72) >= 60 &&
                (analysis?.heartRate ?? 72) <= 100
                  ? "Within normal range"
                  : (analysis?.heartRate ?? 72) < 60
                  ? "Bradycardia detected"
                  : "Tachycardia detected"}
              </span>
            </Card>
            {/* QRS Duration Card */}
            <Card className="p-4 flex flex-col gap-1 shadow-card-subtle">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block bg-green-100 p-2 rounded-full">
                  <svg width="20" height="20" fill="none">
                    <path
                      d="M4 10h3l2-6 3 12 2-6h3"
                      stroke="#22C55E"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-gray-700">
                  QRS Duration
                </span>
              </div>
              <span className="text-2xl font-bold text-green-700">
                {analysis?.qrsDuration ?? 95} ms
              </span>
              <span className="text-sm text-gray-500">
                {(analysis?.qrsDuration ?? 95) >= 80 &&
                (analysis?.qrsDuration ?? 95) <= 120
                  ? "Normal conduction"
                  : "Abnormal conduction"}
              </span>
            </Card>
            {/* ST Segment Card */}
            <Card className="p-4 flex flex-col gap-1 shadow-card-subtle">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block bg-yellow-100 p-2 rounded-full">
                  <svg width="20" height="20" fill="none">
                    <path
                      d="M4 16l4-8 4 8 4-8"
                      stroke="#FACC15"
                      strokeWidth="2"
                    />
                  </svg>
                </span>
                <span className="font-semibold text-gray-700">ST Segment</span>
              </div>
              <span
                className={`text-2xl font-bold ${
                  analysis?.stSegment === "Normal"
                    ? "text-green-700"
                    : "text-yellow-700"
                }`}
              >
                {analysis?.stSegment ?? "Elevated"}
              </span>
              <span className="text-sm text-gray-500">
                {analysis?.stSegment === "Normal"
                  ? "No abnormalities"
                  : "Requires attention"}
              </span>
            </Card>
            {/* Abnormalities Card */}
            <Card className="p-4 flex flex-col gap-1 shadow-card-subtle">
              <div className="flex items-center gap-2 mb-1">
                <span className="inline-block bg-red-100 p-2 rounded-full">
                  <svg width="20" height="20" fill="none">
                    <circle
                      cx="10"
                      cy="10"
                      r="8"
                      stroke="#EF4444"
                      strokeWidth="2"
                    />
                    <path d="M10 7v3" stroke="#EF4444" strokeWidth="2" />
                    <circle cx="10" cy="13" r="1" fill="#EF4444" />
                  </svg>
                </span>
                <span className="font-semibold text-gray-700">
                  Abnormalities
                </span>
              </div>
              <span className="text-2xl font-bold text-red-700">
                {analysis?.irregularities?.length ?? 2} detected
              </span>
              <span className="text-sm text-gray-500">
                {analysis?.irregularities?.length > 0
                  ? "Critical findings"
                  : "No critical findings"}
              </span>
            </Card>
          </div>
        </div>
      </main>
      <div className="flex justify-center py-8">
        <Button
          size="lg"
          className="bg-blue-600 text-white hover:bg-blue-700 px-8 py-3 rounded-lg shadow-lg text-lg font-semibold"
          onClick={() => navigate('/recommendations')}
        >
          View Recommendations
        </Button>
      </div>
    </div>
  );
};

export default Results;
