import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, AlertTriangle, Heart } from "lucide-react";
import type { ECGAnalysis } from "@/types/analysis";

interface ResultCardProps {
  analysis: ECGAnalysis;
}

export const ResultCard = ({ analysis }: ResultCardProps) => {
  const getSeverityColor = (severity: number) => {
    if (severity < 0.3) return "bg-green-100 text-green-800";
    if (severity < 0.7) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  return (
    <Card className="p-6 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-gradient-to-br from-white to-blue-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-6 w-6 text-blue-600" />
          <h3 className="text-xl font-semibold text-gray-800">
            ECG Analysis Results
          </h3>
        </div>
        <Badge
          variant="outline"
          className={getSeverityColor(analysis.abnormalityScore)}
        >
          Risk Score: {(analysis.abnormalityScore * 100).toFixed(1)}%
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" />
            <span className="text-gray-700">Heart Rate: </span>
            <span className="font-semibold">{analysis.heartRate} BPM</span>
          </div>

          {analysis.irregularities.length > 0 && (
            <div className="mt-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
                <span className="font-semibold text-gray-700">
                  Detected Irregularities:
                </span>
              </div>
              <ul className="list-disc list-inside space-y-1 text-gray-600">
                {analysis.irregularities.map((irregularity, index) => (
                  <li key={index} className="ml-4">
                    {irregularity}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2">Key Metrics</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">QRS Duration:</span>
              <span className="font-medium">{analysis.qrsDuration}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">PR Interval:</span>
              <span className="font-medium">{analysis.prInterval}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">QT Interval:</span>
              <span className="font-medium">{analysis.qtInterval}ms</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
