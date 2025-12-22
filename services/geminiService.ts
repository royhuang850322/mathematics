
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, GeneratedPaper, PaperConfig } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Using gemini-3-pro-preview for complex mathematical and multimodal analysis tasks
export const analyzeExamImages = async (base64Images: string[]): Promise<AnalysisResult> => {
  const model = 'gemini-3-pro-preview';
  
  const imageParts = base64Images.map(base64 => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: base64,
    },
  }));

  const response = await ai.models.generateContent({
    model,
    contents: [
      {
        parts: [
          ...imageParts,
          {
            text: "你是一位资深小学数学老师。请分析这些已批改的数学卷子（可能有多张）。识别出所有被打叉（红色错误标记）的题目。提取这些题目的文本，分析它们背后的知识点，并给出简洁的错误原因分析。最后汇总并总结学生的整体薄弱点。",
          },
        ],
      },
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          wrongQuestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                originalText: { type: Type.STRING, description: "题目的原始文本" },
                knowledgePoint: { type: Type.STRING, description: "涉及的具体数学知识点，如：分数乘法、长方形面积、简便运算等" },
                difficulty: { type: Type.STRING, enum: ["简单", "中等", "困难"] },
                analysis: { type: Type.STRING, description: "为什么做错，或者是这道题考察的关键逻辑" },
              },
              required: ["id", "originalText", "knowledgePoint", "difficulty", "analysis"],
            },
          },
          overallSummary: { type: Type.STRING, description: "对这份卷子表现的整体评价" },
          weakPoints: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "提取出的 3-5 个核心薄弱知识点"
          }
        },
        required: ["wrongQuestions", "overallSummary", "weakPoints"],
      },
    },
  });

  // Use response.text directly as a property
  return JSON.parse(response.text || "{}");
};

// Using gemini-3-pro-preview for advanced reasoning and content generation
export const generatePracticePaper = async (weakPoints: string[], config: PaperConfig): Promise<GeneratedPaper> => {
  const model = 'gemini-3-pro-preview';
  const prompt = `基于以下薄弱知识点：${weakPoints.join('、')}，为一名小学生生成一份强化练习卷。
  练习卷应包含 ${config.count} 道题目，涵盖这些知识点。题目整体难度设定为：${config.difficulty}。题目要具有针对性。`;

  const response = await ai.models.generateContent({
    model,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "如果是选择题请提供选项，否则可不提供" 
                },
                answer: { type: Type.STRING },
                explanation: { type: Type.STRING },
                knowledgePoint: { type: Type.STRING },
              },
              required: ["id", "question", "answer", "explanation", "knowledgePoint"],
            },
          },
        },
        required: ["title", "questions"],
      },
    },
  });

  // Use response.text directly as a property
  return JSON.parse(response.text || "{}");
};
