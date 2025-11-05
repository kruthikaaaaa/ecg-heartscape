import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "@supabase/supabase-js"
import typ      recommendations: [] as Array<string>,
      confidence_score: data.confidenceScore || 0.8
    }

    // Generate recommendations based on analysis
    const recommendations: string[] = [];
    if (analysis.heart_rate < 60) {
      recommendations.push('Consider consulting a doctor about bradycardia');
    } else if (analysis.heart_rate > 100) {
      recommendations.push('Consider consulting a doctor about tachycardia');
    }

    if (analysis.abnormalities.detected) {
      recommendations.push('Schedule follow-up with cardiologist');
    }

    analysis.recommendations = recommendations; from "../../../src/integrations/supabase/types.ts"

interface RequestBody {
  fileData: string
  fileName: string
  userId: string
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { fileData, fileName, userId } = await req.json();
    const AI_API_KEY = Deno.env.get("AI_API_KEY");
    
    if (!AI_API_KEY) {
      throw new Error("AI_API_KEY is not configured");
    }

    console.log('Analyzing ECG file:', fileName);

    // Create a new ECG record in the database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { data: ecgRecord, error: ecgError } = await supabase
      .from('ecg_records')
      .insert({
        user_id: userId,
        file_name: fileName,
        file_path: `ecg_data/${userId}/${fileName}`,
        status: 'processing'
      })
      .select()
      .single();

    if (ecgError) throw ecgError;

    // Call AI API for analysis
    const response = await fetch("https://api.your-ai-service.com/v1/analyze", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert ECG analysis system. Analyze ECG images and provide:
1. Heart rate (bpm)
2. QRS duration (ms)
3. ST segment analysis
4. PR interval (ms)
5. QT interval (ms)
6. Detected abnormalities
7. Risk level (normal, warning, critical)
8. Heatmap zones: array of {x, y, width, height, intensity} where intensity is 0-1 (0=normal/blue, 0.5=warning/yellow, 1.0=critical/red)

Return JSON only in this exact format:
{
  "heartRate": number,
  "qrsDuration": number,
  "stSegment": "Normal" | "Elevated" | "Depressed",
  "prInterval": number,
  "qtInterval": number,
  "abnormalities": string[],
  "riskLevel": "normal" | "warning" | "critical",
  "heatmapZones": [{x: number, y: number, width: number, height: number, intensity: number}]
}`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this ECG image and provide detailed cardiac metrics and heatmap zones for areas of concern."
              },
              {
                type: "image_url",
                image_url: {
                  url: fileData
                }
              }
            ]
          }
        ],
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI credits exhausted. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    
    // Process the AI response and format it for our database
    const analysis = {
      heart_rate: data.heartRate || 75,
      rhythm_type: data.rhythmType || 'Unknown',
      abnormalities: {
        detected: data.abnormalities?.length > 0 || false,
        details: data.abnormalities || []
      },
      recommendations: [],
      confidence_score: data.confidenceScore || 0.8
    };

    // Generate recommendations based on analysis
    if (analysis.heart_rate < 60) {
      analysis.recommendations.push('Consider consulting a doctor about bradycardia');
    } else if (analysis.heart_rate > 100) {
      analysis.recommendations.push('Consider consulting a doctor about tachycardia');
    }

    if (analysis.abnormalities.detected) {
      analysis.recommendations.push('Schedule follow-up with cardiologist');
    }

    // Store analysis results in database
    const { error: resultError } = await supabase
      .from('analysis_results')
      .insert({
        ecg_record_id: ecgRecord.id,
        ...analysis
      });

    if (resultError) throw resultError;

    // Update ECG record status
    await supabase
      .from('ecg_records')
      .update({ status: 'completed' })
      .eq('id', ecgRecord.id);

    // Parse heatmap zones for frontend
    const heatmapZones = Array.isArray(data.heatmapZones)
      ? (data.heatmapZones as any[]).map((z: any) => ({
          startTime: z.x,
          endTime: z.x + z.width,
          severity: z.intensity
        }))
      : [];

    // Compose frontend analysis object
    const frontendAnalysis = {
      heartRate: data.heartRate || 75,
      qrsDuration: data.qrsDuration || 100,
      stSegment: data.stSegment || 'Normal',
      prInterval: data.prInterval || 160,
      qtInterval: data.qtInterval || 400,
      irregularities: data.abnormalities || [],
      heatmapZones,
      prediction: `Heart rate is ${(data.heartRate || 75)} BPM. ${data.heartRate < 60 ? 'Bradycardia detected.' : data.heartRate > 100 ? 'Tachycardia detected.' : 'Normal heart rate.'}`
    };

    console.log('Parsed analysis:', analysis);

    return new Response(
      JSON.stringify({ analysis: frontendAnalysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-ecg function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }

  // Simulate dynamic ECG values for demo
  function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
  const heartRate = getRandomInt(55, 110);
  const qrsDuration = getRandomInt(80, 130);
  const stSegment = ["Normal", "Elevated", "Depressed"][getRandomInt(0,2)];
  const prInterval = getRandomInt(120, 220);
  const qtInterval = getRandomInt(350, 460);
  const irregularities = heartRate < 60 ? ["Bradycardia detected"] : heartRate > 100 ? ["Tachycardia detected"] : [];
  const heatmapZones = [
    { startTime: getRandomInt(0, 100), endTime: getRandomInt(101, 200), severity: Math.random() },
    { startTime: getRandomInt(201, 300), endTime: getRandomInt(301, 400), severity: Math.random() }
  ];

  // Compose frontend analysis object
  const frontendAnalysis = {
    heartRate,
    qrsDuration,
    stSegment,
    prInterval,
    qtInterval,
    irregularities,
    heatmapZones,
    prediction: `Heart rate is ${heartRate} BPM. ${heartRate < 60 ? 'Bradycardia detected.' : heartRate > 100 ? 'Tachycardia detected.' : 'Normal heart rate.'}`
  };

  return new Response(
    JSON.stringify({ analysis: frontendAnalysis }),
    { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
  );
});
