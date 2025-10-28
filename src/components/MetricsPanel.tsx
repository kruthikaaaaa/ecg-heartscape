import { Card } from "@/components/ui/card";
import { Activity, Heart, TrendingUp, AlertCircle } from "lucide-react";

export const MetricsPanel = () => {
  // Synthetic analysis data
  const metrics = [
    {
      icon: Heart,
      label: "Heart Rate",
      value: "72 BPM",
      status: "normal",
      description: "Within normal range",
    },
    {
      icon: Activity,
      label: "QRS Duration",
      value: "95 ms",
      status: "normal",
      description: "Normal conduction",
    },
    {
      icon: TrendingUp,
      label: "ST Segment",
      value: "Elevated",
      status: "warning",
      description: "Requires attention",
    },
    {
      icon: AlertCircle,
      label: "Abnormalities",
      value: "2 detected",
      status: "critical",
      description: "Critical findings",
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

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Analysis Metrics</h3>
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

      <Card className="p-4 bg-gradient-card shadow-card-subtle">
        <h4 className="font-semibold mb-2 text-sm">Analysis Summary</h4>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The ECG analysis detected 2 abnormal patterns requiring clinical review. 
          ST segment elevation and irregular rhythm patterns suggest potential cardiac events. 
          Immediate consultation recommended.
        </p>
      </Card>
    </div>
  );
};
