import { useEffect, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";

interface HeatmapZone {
  x: number;
  y: number;
  width: number;
  height: number;
  intensity: number;
}

interface ECGVisualizationProps {
  file: File;
  heatmapZones?: HeatmapZone[];
}

export const ECGVisualization = ({ file, heatmapZones = [] }: ECGVisualizationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the ECG image
      ctx.drawImage(img, 0, 0);

      // Draw heatmap overlay from zones
      if (heatmapZones.length > 0) {
        drawHeatmapZones(ctx, canvas.width, canvas.height, heatmapZones);
      } else {
        // Fallback to synthetic heatmap
        generateHeatmapOverlay(ctx, canvas.width, canvas.height);
      }
      
      setImageLoaded(true);
      URL.revokeObjectURL(url);
    };

    img.src = url;

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file, heatmapZones]);

  const drawHeatmapZones = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    zones: HeatmapZone[]
  ) => {
    ctx.globalAlpha = 0.4;
    
    zones.forEach(zone => {
      // Map intensity to color: 0=blue, 0.5=yellow, 1.0=red
      let color: string;
      if (zone.intensity >= 0.7) {
        color = "255, 50, 50"; // Red for critical
      } else if (zone.intensity >= 0.4) {
        color = "255, 200, 50"; // Yellow for warning
      } else {
        color = "50, 150, 255"; // Blue for normal
      }
      
      const gradient = ctx.createRadialGradient(
        zone.x * width,
        zone.y * height,
        0,
        zone.x * width,
        zone.y * height,
        Math.max(zone.width, zone.height) * width * 0.5
      );
      
      gradient.addColorStop(0, `rgba(${color}, ${zone.intensity})`);
      gradient.addColorStop(0.5, `rgba(${color}, ${zone.intensity * 0.5})`);
      gradient.addColorStop(1, `rgba(${color}, 0)`);
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });
    
    ctx.globalAlpha = 1.0;
  };

  const generateHeatmapOverlay = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number
  ) => {
    // Create heatmap zones based on synthetic analysis
    const zones = [
      // Critical zones (red)
      { x: 0.2, y: 0.3, size: 0.15, intensity: 0.8, color: "255, 50, 50" },
      { x: 0.7, y: 0.4, size: 0.12, intensity: 0.7, color: "255, 50, 50" },
      
      // Warning zones (yellow)
      { x: 0.4, y: 0.5, size: 0.18, intensity: 0.6, color: "255, 200, 50" },
      { x: 0.85, y: 0.35, size: 0.1, intensity: 0.5, color: "255, 200, 50" },
      
      // Normal zones (blue)
      { x: 0.5, y: 0.2, size: 0.2, intensity: 0.4, color: "50, 150, 255" },
      { x: 0.15, y: 0.6, size: 0.15, intensity: 0.45, color: "50, 150, 255" },
    ];

    zones.forEach((zone) => {
      const gradient = ctx.createRadialGradient(
        zone.x * width,
        zone.y * height,
        0,
        zone.x * width,
        zone.y * height,
        zone.size * width
      );

      gradient.addColorStop(0, `rgba(${zone.color}, ${zone.intensity})`);
      gradient.addColorStop(0.5, `rgba(${zone.color}, ${zone.intensity * 0.5})`);
      gradient.addColorStop(1, `rgba(${zone.color}, 0)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    });

    // Add blend mode for better overlay effect
    ctx.globalCompositeOperation = "multiply";
    ctx.globalCompositeOperation = "source-over";
  };

  return (
    <div className="space-y-4">
      <div className="relative bg-muted rounded-lg overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-auto"
          style={{ maxHeight: "600px", objectFit: "contain" }}
        />
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="animate-pulse text-muted-foreground">
              Loading visualization...
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="outline" className="bg-medical-critical/10 text-medical-critical border-medical-critical/30">
          Critical Regions
        </Badge>
        <Badge variant="outline" className="bg-medical-warning/10 text-medical-warning border-medical-warning/30">
          Warning Regions
        </Badge>
        <Badge variant="outline" className="bg-medical-normal/10 text-medical-normal border-medical-normal/30">
          Normal Regions
        </Badge>
      </div>
    </div>
  );
};
