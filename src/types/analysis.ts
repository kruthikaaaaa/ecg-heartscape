export interface ECGAnalysis {
  heart_rate: number;
  rhythm_type: string;
  abnormalities: {
    detected: boolean;
    details: string[];
  };
  recommendations: string[];
  confidence_score: number;
}

export interface AnalysisResponse {
  success: boolean;
  data: ECGAnalysis;
  error?: string;
}
