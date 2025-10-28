import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Activity, BookOpen } from "lucide-react";
import { ECGVisualization } from "@/components/ECGVisualization";
import { MetricsPanel } from "@/components/MetricsPanel";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const file = location.state?.file;

  useEffect(() => {
    if (!file) {
      navigate("/");
    }
  }, [file, navigate]);

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
                <h2 className="text-lg font-semibold mb-2">ECG Waveform with Heatmap</h2>
                <p className="text-sm text-muted-foreground">
                  File: {file.name}
                </p>
              </div>
              <ECGVisualization file={file} />
            </Card>
          </div>

          <div className="space-y-6">
            <MetricsPanel />
            
            <Card className="p-6 shadow-card-elegant bg-gradient-medical-subtle">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Need Guidance?</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Learn how to interpret your heatmap results and get recommendations for addressing critical findings.
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
