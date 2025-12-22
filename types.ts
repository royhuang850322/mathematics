
export interface WrongQuestion {
  id: string;
  originalText: string;
  knowledgePoint: string;
  difficulty: '简单' | '中等' | '困难';
  analysis: string;
}

export interface AnalysisResult {
  wrongQuestions: WrongQuestion[];
  overallSummary: string;
  weakPoints: string[];
}

export interface GeneratedQuestion {
  id: string;
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
  knowledgePoint: string;
  timestamp?: number;
}

export interface GeneratedPaper {
  title: string;
  questions: GeneratedQuestion[];
}

export interface PaperConfig {
  count: number;
  difficulty: '简单' | '中等' | '困难';
}
