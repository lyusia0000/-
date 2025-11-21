import { GoogleGenAI, Type, Modality } from "@google/genai";
import { DEPARTMENT_DATA, AnalysisResult, Language } from "../types";

const getSystemPrompt = (lang: Language) => `
You are an AI guide for the POSTECH1986 exhibition.
Your task is to analyze a visitor's photo and generate content for a "POSTECH Student ID Card" of the future.

**Input:** A portrait photo of a visitor.

**Task Instructions:**

1. **Photo Analysis:**
   - Analyze the facial expression for emotion (curiosity, focus, confidence, etc.).
   - Identify secondary traits (analytical, creative, empathetic, etc.).
   - Infer cognitive style (logical, experimental, design-oriented, etc.).

2. **Department Matching:**
   - Select ONE department from this list that best matches the user's traits:
     ${DEPARTMENT_DATA.map(d => d.name).join(', ')}.
   - Create a brief reason for this match.

3. **Intro Text Generation:**
   - Create a short, energetic intro message (appearing before the result).
   - Format: "POSTECH Future Talent Scan Complete! ... (Custom department-specific welcome)" (Translate to ${lang === 'en' ? 'English' : 'Korean'}).

4. **Student ID Content Generation:**
   - **Student Type**: "Future POSTECH [Department] Researcher" (Translate to ${lang === 'en' ? 'English' : 'Korean'})
   - **Key Traits**: List 3 distinct traits formatted as hashtags (e.g., #Analytical #Creative).
   - **Reason**: 1-2 sentences explaining why this department fits based on facial features.
   - **Bottom Line**: An encouraging closing sentence about their potential in this field.

**Tone & Style:**
- Friendly, encouraging, futuristic, exhibition-style.
- Language: **${lang === 'en' ? 'English' : 'Korean (한국어)'}**.
- Use the concept of "POSTECH Red (Pantone 215C)" conceptually if needed in text, but mostly focus on the content.

**Output Schema (JSON):**
- introMessage: string
- studentId.studentType: string
- studentId.department: string
- studentId.keyTraits: string array
- studentId.reason: string
- studentId.bottomLine: string
`;

export const analyzeImage = async (base64Image: string, lang: Language): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
          {
            text: `Analyze visitor and issue a future POSTECH student ID in ${lang === 'en' ? 'English' : 'Korean'}.`,
          },
        ],
      },
      config: {
        systemInstruction: getSystemPrompt(lang),
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            introMessage: { type: Type.STRING },
            studentId: {
              type: Type.OBJECT,
              properties: {
                studentType: { type: Type.STRING },
                department: { type: Type.STRING },
                keyTraits: { type: Type.ARRAY, items: { type: Type.STRING } },
                reason: { type: Type.STRING },
                bottomLine: { type: Type.STRING },
              },
              required: ["studentType", "department", "keyTraits", "reason", "bottomLine"],
            },
          },
          required: ["introMessage", "studentId"],
        },
      },
    });

    const text = response.text;
    if (!text) {
        throw new Error("No response from AI");
    }
    return JSON.parse(text) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

export const generateCaricature = async (base64Image: string): Promise<string> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `
    Create a friendly, semi-realistic digital art portrait of this person as a future scientist.
    Keep facial features recognizable but stylized.
    Theme: Future POSTECH Researcher.
    Background: A high-tech, bright academic lab or campus setting.
    Colors: Use white, silver, and accents of deep red (POSTECH color).
    Vibe: Intelligent, visionary, confident.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: 'image/jpeg',
              data: base64Image,
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    const parts = response.candidates?.[0]?.content?.parts;
    if (parts) {
        for (const part of parts) {
            if (part.inlineData && part.inlineData.data) {
                return part.inlineData.data;
            }
        }
    }
    
    throw new Error("No image generated");
  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};