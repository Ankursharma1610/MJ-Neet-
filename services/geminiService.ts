
import { GoogleGenAI, Type } from "@google/genai";
import { Subject, MCQ, NoteModule, QuizResult, RemedialPlan } from "../types.ts";

// Direct initialization as required by system instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const SYSTEM_INSTRUCTION = `You are the 'NEET Scholar AI,' an elite tutor specialized in the NTA NEET-UG syllabus.
Core Mandate: 
1. Data Source: Every response must strictly align with NCERT Biology, Physics, and Chemistry (Classes 11 & 12). Prioritize minor footnotes, diagram labels, and 'Did You Know' sections.
2. Difficulty Level: Target Top 1% rankers. Quizzes must be 'AIIMS-level' difficult. 
3. Depth Requirements:
   - Biology: Include specific enzyme names, sub-cellular locations, and stoichiometric ratios (e.g., ATP count in respiration).
   - Physics: Include boundary conditions, limiting cases, and vector nuances.
   - Chemistry: Include hybridizations, bond angles, and specific temperature/pressure conditions for reactions.
4. Question Design Logic: 
   - Use 'Assertion-Reasoning' where both are true but the Reason is NOT the correct explanation.
   - Multi-statement questions: Present 5 complex statements; ask "How many are INCORRECT?".
5. Response Tone: Academic, rigorous, and highly focused on precision.`;

export const generateNotes = async (topic: string): Promise<NoteModule> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Exhaustive NCERT Deep-Dive for the topic: ${topic}. 
    Provide:
    1. A detailed Concept Overview.
    2. A "Deep-Dive Mechanism" explaining 'How' and 'Why' at a molecular or physical level.
    3. Examiner Traps: Common ways NTA tricks students on this specific topic.
    4. Critical Data: Essential constants, values, or ratios that must be memorized.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          topic: { type: Type.STRING },
          conceptOverview: { type: Type.STRING, description: "Detailed summary of the topic" },
          deepDiveMechanism: { type: Type.STRING, description: "Step-by-step technical mechanism or mathematical derivation" },
          keyNcertLines: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Direct verbatim lines or high-yield summary points" },
          confusedTerms: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term1: { type: Type.STRING },
                term2: { type: Type.STRING },
                difference: { type: Type.STRING }
              }
            }
          },
          mnemonics: { type: Type.ARRAY, items: { type: Type.STRING } },
          examTraps: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific tricks used in NEET/AIIMS questions" },
          criticalData: { 
            type: Type.ARRAY, 
            items: {
              type: Type.OBJECT,
              properties: {
                label: { type: Type.STRING },
                value: { type: Type.STRING }
              }
            },
            description: "Numerical values, constants, or ratios"
          }
        },
        required: ["topic", "conceptOverview", "deepDiveMechanism", "keyNcertLines", "confusedTerms", "mnemonics", "examTraps", "criticalData"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const generateQuiz = async (topic: string, count: number = 5): Promise<MCQ[]> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Generate ${count} AIIMS-LEVEL ELITE MCQs for: ${topic}. 
    - At least 2 Assertion-Reasoning (Tricky link).
    - At least 1 'How many statements are correct' type.
    - 2 Deep conceptual/numerical traps.
    Focus on areas with high negative marking rates.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            correctAnswer: { type: Type.NUMBER, description: "0-indexed" },
            explanation: { type: Type.STRING, description: "Granular breakdown of why other options are wrong" },
            ncertReference: { type: Type.STRING, description: "Chapter and Page/Topic context" },
            type: { type: Type.STRING, enum: ["standard", "assertion-reason", "statement-based", "match-following"] }
          },
          required: ["id", "question", "options", "correctAnswer", "explanation", "ncertReference", "type"]
        }
      }
    }
  });
  return JSON.parse(response.text.trim());
};

export const getRemedialPlan = async (result: QuizResult): Promise<RemedialPlan> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Error Pattern Analysis: Student scored ${result.score}/${result.total} in '${result.topic}'. Errors detected in: ${result.missedTopics.join(', ')}. Generate a high-performance correction plan focusing on conceptual weak-links.`,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          plan: { type: Type.STRING },
          simplifiedNotes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["plan", "simplifiedNotes"]
      }
    }
  });
  return JSON.parse(response.text.trim());
};
