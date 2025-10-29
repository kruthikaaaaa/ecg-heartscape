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
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 shadow-card-subtle">
              <div className="mb-4">
                <h2 className="text-lg font-semibold mb-2">
                  ECG Waveform with Heatmap
                </h2>
                <p className="text-sm text-muted-foreground">
                  File: {file.name}
                </p>
              </div>
              <ECGVisualization
                file={file}
                heatmapZones={
                  Array.isArray((analysis as any)?.heatmapZones)
                    ? (analysis as any).heatmapZones
                    : []
                }
              />
            </Card>
          </div>

          <div className="space-y-6">
            <MetricsPanel analysis={analysis} loading={loading} />

            <Card className="p-6 shadow-card-elegant bg-gradient-medical-subtle">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Need Guidance?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how to interpret your heatmap results and get
                  recommendations for addressing critical findings.
                </p>
                <Button
                  onClick={() => navigate("/recommendations")}
                  className="w-full"
                >
                  View Recommendations
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Results;
