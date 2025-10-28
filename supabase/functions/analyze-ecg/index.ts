import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileData, fileName } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log('Analyzing ECG file:', fileName);

    // Call Lovable AI with vision capabilities
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
    const analysisText = data.choices[0].message.content;
    
    console.log('Raw AI response:', analysisText);

    // Parse JSON from response
    let analysis;
    try {
      // Try to extract JSON from markdown code blocks if present
      const jsonMatch = analysisText.match(/```json\n([\s\S]*?)\n```/) || 
                       analysisText.match(/```\n([\s\S]*?)\n```/);
      
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[1]);
      } else {
        analysis = JSON.parse(analysisText);
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      // Return fallback data if parsing fails
      analysis = {
        heartRate: 75,
        qrsDuration: 90,
        stSegment: "Normal",
        prInterval: 160,
        qtInterval: 400,
        abnormalities: ["Unable to parse detailed analysis"],
        riskLevel: "warning",
        heatmapZones: [
          { x: 0.1, y: 0.3, width: 0.2, height: 0.4, intensity: 0.3 }
        ]
      };
    }

    console.log('Parsed analysis:', analysis);

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-ecg function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
