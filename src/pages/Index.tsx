import { FileUpload } from "@/components/FileUpload";
import { Activity, Heart, Zap } from "lucide-react";
import { Card } from "@/components/ui/card";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 rounded-xl bg-gradient-medical shadow-medical">
              <Activity className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-medical bg-clip-text text-transparent">
              CVD Analysis
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced ECG analysis with AI-powered heatmap visualization for cardiovascular disease detection
          </p>
        </header>

        <div className="max-w-4xl mx-auto grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <FileUpload />
          </div>

          <div className="space-y-4">
            <Card className="p-6 shadow-card-subtle">
              <div className="flex items-start gap-3 mb-3">
                <Heart className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Accurate Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    Multi-zone heatmap analysis with red, yellow, and blue indicators
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card-subtle">
              <div className="flex items-start gap-3 mb-3">
                <Zap className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Instant Results</h3>
                  <p className="text-sm text-muted-foreground">
                    Real-time processing with comprehensive metrics and insights
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 shadow-card-subtle bg-gradient-card">
              <div className="flex items-start gap-3 mb-3">
                <Activity className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-semibold mb-1">Clinical Grade</h3>
                  <p className="text-sm text-muted-foreground">
                    Professional analysis tools trusted by healthcare professionals
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
