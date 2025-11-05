import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Heart,
  AlertTriangle,
  CheckCircle,
  Activity,
} from "lucide-react";

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
        <div className="max-w-4xl mx-auto space-y-8">
          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">
                Understanding Your ECG Heatmap
              </CardTitle>
              <CardDescription>
                Learn what the color zones mean and how to address critical
                findings
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-4 flex flex-col items-start">
                <span className="text-xl font-bold text-red-600 mb-2">
                  &#9888; Red Zones
                </span>
                <span className="text-gray-700">
                  Indicates abnormal cardiac activity requiring immediate
                  medical attention.
                </span>
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-start">
                <span className="text-xl font-bold text-yellow-500 mb-2">
                  &#x23F1; Yellow Zones
                </span>
                <span className="text-gray-700">
                  Shows areas of concern that should be monitored and evaluated
                  by a physician.
                </span>
              </div>
              <div className="border rounded-lg p-4 flex flex-col items-start">
                <span className="text-xl font-bold text-blue-600 mb-2">
                  &#x2714; Blue Zones
                </span>
                <span className="text-gray-700">
                  Represents normal cardiac electrical activity with no
                  abnormalities detected.
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-red-600 flex items-center gap-2">
                &#9888; Critical Zone Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h3 className="font-semibold text-lg mb-2">Immediate Actions:</h3>
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                <li>
                  Consult a cardiologist immediately for comprehensive
                  evaluation
                </li>
                <li>
                  Avoid strenuous physical activities until cleared by a
                  physician
                </li>
                <li>
                  Monitor symptoms such as chest pain, shortness of breath, or
                  dizziness
                </li>
                <li>Keep emergency contact numbers readily available</li>
                <li>
                  Consider wearing a Holter monitor for 24-48 hour continuous
                  monitoring
                </li>
              </ul>
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
                  <li>
                    Schedule an appointment with your healthcare provider within
                    1-2 weeks
                  </li>
                  <li>
                    Monitor and log any cardiac symptoms or irregular sensations
                  </li>
                  <li>Reduce caffeine and stimulant intake</li>
                  <li>Ensure adequate rest and manage stress levels</li>
                  <li>Review current medications with your doctor</li>
                </ul>
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-lg">
                  Lifestyle Modifications:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Follow a heart-healthy diet rich in fruits, vegetables, and
                    whole grains
                  </li>
                  <li>
                    Engage in moderate exercise as approved by your doctor
                  </li>
                  <li>
                    Maintain healthy blood pressure and cholesterol levels
                  </li>
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
                <h3 className="font-semibold text-lg">
                  Continue Healthy Habits:
                </h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>
                    Maintain regular cardiovascular exercise (150 minutes per
                    week)
                  </li>
                  <li>
                    Continue balanced nutrition with low sodium and saturated
                    fats
                  </li>
                  <li>Regular health check-ups and ECG screenings annually</li>
                  <li>
                    Manage stress through meditation, yoga, or relaxation
                    techniques
                  </li>
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
                This analysis tool is for educational and screening purposes
                only. It does not replace professional medical diagnosis or
                treatment. Always consult with a qualified healthcare provider
                before making any decisions about your heart health. In case of
                emergency symptoms (severe chest pain, difficulty breathing,
                loss of consciousness), call emergency services immediately.
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card-elegant">
            <CardHeader>
              <CardTitle className="text-2xl">Recommended Actions</CardTitle>
              <CardDescription>
                Based on your ECG results, please consider the following
                recommendations:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <ul className="list-disc list-inside space-y-2 text-base text-gray-700">
                <li>
                  Consult a cardiologist if any abnormalities are detected.
                </li>
                <li>
                  Monitor your heart rate regularly, especially if outside the
                  normal range (60-100 BPM).
                </li>
                <li>
                  Follow up for further tests if QRS duration or ST segment is
                  abnormal.
                </li>
                <li>
                  Adopt a heart-healthy lifestyle: regular exercise, balanced
                  diet, and stress management.
                </li>
                <li>
                  Take prescribed medications as directed by your healthcare
                  provider.
                </li>
                <li>
                  Seek immediate medical attention if you experience chest pain,
                  fainting, or severe palpitations.
                </li>
              </ul>
            </CardContent>
          </Card>

          <div className="flex justify-center gap-4">
            <Button onClick={() => navigate("/")} variant="outline">
              Upload New ECG
            </Button>
            <Button onClick={() => navigate(-1)}>Back to Results</Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recommendations;
