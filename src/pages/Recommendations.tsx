import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, AlertTriangle, CheckCircle, Activity } from "lucide-react";

const Recommendations = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
            <div className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold">ECG Analysis Guidance</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Understanding Your ECG Heatmap</CardTitle>
              <CardDescription>
                Learn what the color zones mean and how to address critical findings
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-2 border-critical bg-critical/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-5 w-5 text-critical" />
                      <Badge className="bg-critical text-white">Critical</Badge>
                    </div>
                    <CardTitle className="text-lg">Red Zones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Indicates abnormal cardiac activity requiring immediate medical attention.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-warning bg-warning/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Activity className="h-5 w-5 text-warning" />
                      <Badge className="bg-warning text-white">Warning</Badge>
                    </div>
                    <CardTitle className="text-lg">Yellow Zones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Shows areas of concern that should be monitored and evaluated by a physician.
                    </p>
                  </CardContent>
                </Card>

                <Card className="border-2 border-safe bg-safe/5">
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5 text-safe" />
                      <Badge className="bg-safe text-white">Normal</Badge>
                    </div>
                    <CardTitle className="text-lg">Blue Zones</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Represents normal cardiac electrical activity with no abnormalities detected.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-critical" />
                Critical Zone Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Immediate Actions:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Consult a cardiologist immediately for comprehensive evaluation</li>
                  <li>Avoid strenuous physical activities until cleared by a physician</li>
                  <li>Monitor symptoms such as chest pain, shortness of breath, or dizziness</li>
                  <li>Keep emergency contact numbers readily available</li>
                  <li>Consider wearing a Holter monitor for 24-48 hour continuous monitoring</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Potential Underlying Conditions:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Arrhythmias (irregular heart rhythms)</li>
                  <li>Myocardial ischemia (reduced blood flow to heart)</li>
                  <li>ST-segment elevation/depression indicating possible heart attack</li>
                  <li>QT prolongation increasing risk of dangerous arrhythmias</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-warning" />
                Warning Zone Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Preventive Measures:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Schedule an appointment with your healthcare provider within 1-2 weeks</li>
                  <li>Monitor and log any cardiac symptoms or irregular sensations</li>
                  <li>Reduce caffeine and stimulant intake</li>
                  <li>Ensure adequate rest and manage stress levels</li>
                  <li>Review current medications with your doctor</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Lifestyle Modifications:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Follow a heart-healthy diet rich in fruits, vegetables, and whole grains</li>
                  <li>Engage in moderate exercise as approved by your doctor</li>
                  <li>Maintain healthy blood pressure and cholesterol levels</li>
                  <li>Quit smoking and limit alcohol consumption</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-safe" />
                Normal Zone Maintenance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Continue Healthy Habits:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Maintain regular cardiovascular exercise (150 minutes per week)</li>
                  <li>Continue balanced nutrition with low sodium and saturated fats</li>
                  <li>Regular health check-ups and ECG screenings annually</li>
                  <li>Manage stress through meditation, yoga, or relaxation techniques</li>
                  <li>Stay hydrated and maintain healthy weight</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant bg-gradient-medical-subtle">
            <CardHeader>
              <CardTitle>Important Disclaimer</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                This analysis tool is for educational and screening purposes only. It does not replace 
                professional medical diagnosis or treatment. Always consult with a qualified healthcare 
                provider before making any decisions about your heart health. In case of emergency 
                symptoms (severe chest pain, difficulty breathing, loss of consciousness), call emergency 
                services immediately.
              </p>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/")} variant="outline">
              Upload New ECG
            </Button>
            <Button onClick={() => navigate(-1)}>
              Back to Results
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
