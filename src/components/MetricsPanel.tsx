import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Heart, TrendingUp, AlertCircle, Clock } from "lucide-react";

interface MetricsPanelProps {
  analysis?: {
    heartRate: number;
    qrsDuration: number;
    stSegment: string;
    prInterval: number;
    qtInterval: number;
    abnormalities: string[];
    riskLevel?: string;
  };
  loading?: boolean;
}

export const MetricsPanel = ({ analysis, loading }: MetricsPanelProps) => {
  if (loading) {
    return (
      <div className="space-y-4">
        <Card className="p-6 shadow-card-subtle">
          <div className="flex items-center justify-center py-8">
            <div className="animate-pulse text-muted-foreground flex items-center gap-2">
              <Activity className="h-5 w-5 animate-spin" />
              Analyzing ECG data...
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!analysis) {
    return null;
  }

  const metrics = [
    {
      icon: Heart,
      label: "Heart Rate",
      value: `${analysis.heartRate} BPM`,
      status: analysis.heartRate >= 60 && analysis.heartRate <= 100 ? "normal" : "warning",
      description: analysis.heartRate >= 60 && analysis.heartRate <= 100 ? "Within normal range" : "Outside normal range",
    },
    {
      icon: Activity,
      label: "QRS Duration",
      value: `${analysis.qrsDuration} ms`,
      status: analysis.qrsDuration >= 80 && analysis.qrsDuration <= 120 ? "normal" : "warning",
      description: analysis.qrsDuration >= 80 && analysis.qrsDuration <= 120 ? "Normal conduction" : "Abnormal conduction",
    },
    {
      icon: TrendingUp,
      label: "ST Segment",
      value: analysis.stSegment,
      status: analysis.stSegment === "Normal" ? "normal" : "warning",
      description: analysis.stSegment === "Normal" ? "No abnormalities" : "Requires attention",
    },
    {
      icon: Clock,
      label: "PR Interval",
      value: `${analysis.prInterval} ms`,
      status: analysis.prInterval >= 120 && analysis.prInterval <= 200 ? "normal" : "warning",
      description: analysis.prInterval >= 120 && analysis.prInterval <= 200 ? "Normal timing" : "Abnormal timing",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "text-medical-safe";
      case "warning":
        return "text-medical-warning";
      case "critical":
        return "text-medical-critical";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case "normal":
        return "bg-medical-safe/10";
      case "warning":
        return "bg-medical-warning/10";
      case "critical":
        return "bg-medical-critical/10";
      default:
        return "bg-muted";
    }
  };

  const getRiskBadge = () => {
    if (!analysis.riskLevel) return null;
    
    const variants: Record<string, "default" | "destructive" | "outline"> = {
      normal: "outline",
      warning: "default",
      critical: "destructive"
    };
    
    return (
      <Badge variant={variants[analysis.riskLevel] || "default"} className="mb-4">
        Risk Level: {analysis.riskLevel.toUpperCase()}
      </Badge>
    );
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analysis Metrics</h3>
      
      {getRiskBadge()}
      
      {metrics.map((metric, index) => (
        <Card key={index} className="p-4 shadow-card-subtle">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${getStatusBg(metric.status)}`}>
              <metric.icon className={`h-5 w-5 ${getStatusColor(metric.status)}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1">{metric.label}</p>
              <p className={`text-lg font-semibold ${getStatusColor(metric.status)}`}>
                {metric.value}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {metric.description}
              </p>
            </div>
          </div>
        </Card>
      ))}

      {analysis.abnormalities && analysis.abnormalities.length > 0 && (
        <Card className="p-4 bg-gradient-card shadow-card-subtle">
          <div className="flex items-start gap-2 mb-2">
            <AlertCircle className="h-5 w-5 text-medical-critical mt-0.5" />
            <h4 className="font-semibold text-sm">Detected Abnormalities</h4>
          </div>
          <ul className="space-y-1">
            {analysis.abnormalities.map((abnormality, index) => (
              <li key={index} className="text-sm text-muted-foreground leading-relaxed">
                • {abnormality}
              </li>
            ))}
          </ul>
          <p className="text-xs text-muted-foreground mt-3">
            Please consult with a healthcare professional for proper diagnosis.
          </p>
        </Card>
      )}
    </div>
  );
};
