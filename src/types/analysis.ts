export interface ECGAnalysis {
  heartRate: number;
  rhythmType: string;
  abnormalityScore: number;
  irregularities: string[];
  qrsDuration: number;
  prInterval: number;
  stSegment: string;
  qtInterval: number;
  heatmapZones: Array<{
    startTime: number;
    endTime: number;
    severity: number;
  }>;
  summary?: string;
}

export interface AnalysisResponse {
  success: boolean;
  analysis: ECGAnalysis;
  error?: string;
}
