
import { GeneratedQuestion } from "../types";

const STORAGE_KEY = "zhixue_question_bank";

export const saveQuestionsToBank = (questions: GeneratedQuestion[]) => {
  const existing = getQuestionBank();
  const timestamp = Date.now();
  const newQuestions = questions.map(q => ({ ...q, timestamp }));
  
  // Combine and remove duplicates based on question text (simplified)
  const combined = [...newQuestions, ...existing];
  const unique = combined.filter((q, index, self) =>
    index === self.findIndex((t) => t.question === q.question)
  );

  localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
};

export const getQuestionBank = (): GeneratedQuestion[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const clearQuestionBank = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteFromBank = (id: string) => {
  const existing = getQuestionBank();
  const filtered = existing.filter(q => q.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};
