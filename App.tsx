import React, { useState } from 'react';
import FileUploader from './components/FileUploader.tsx';
import AnalysisDisplay from './components/AnalysisDisplay.tsx';
import PracticePaper from './components/PracticePaper.tsx';
import QuestionBank from './components/QuestionBank.tsx';
import { analyzeExamImages, generatePracticePaper } from './services/geminiService.ts';
import { saveQuestionsToBank } from './services/storageService.ts';
import { AnalysisResult, GeneratedPaper, PaperConfig } from './types.ts';

const App: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [paper, setPaper] = useState<GeneratedPaper | null>(null);
  const [showBank, setShowBank] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getErrorMessage = (err: any, fallback: string): string => {
    const message = err?.message || String(err);
    console.error("Caught error:", err);

    if (message.includes('SAFETY')) {
      return "内容识别受限。请确保上传的试卷内容符合教学规范，且不包含敏感信息。";
    }
    if (message.includes('IMAGE') || message.includes('inlineData')) {
      return "图片解析失败。请确保上传的是清晰的 JPG/PNG 格式照片。";
    }
    if (message.includes('429') || message.includes('quota')) {
      return "请求过于频繁，请稍等片刻后再试。";
    }
    if (message.includes('Network') || message.includes('fetch')) {
      return "网络连接异常，请检查您的网络设置后重试。";
    }
    
    return fallback;
  };

  const handleAnalyze = async (base64Array: string[]) => {
    if (base64Array.length === 0) return;
    setLoading(true);
    setError(null);
    setPaper(null);
    try {
      const result = await analyzeExamImages(base64Array);
      
      if (!result.wrongQuestions || result.wrongQuestions.length === 0) {
        setError("未能在照片中识别到被打叉（红色标记）的错题。请确保照片清晰，且批改痕迹明显。");
        setAnalysis(null);
      } else {
        setAnalysis(result);
      }
    } catch (err) {
      setError(getErrorMessage(err, "分析卷子失败。建议上传光线更充足、字迹更清晰的试卷照片。"));
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePaper = async (config: PaperConfig) => {
    if (!analysis) return;
    setGenerating(true);
    setError(null);
    try {
      const result = await generatePracticePaper(analysis.weakPoints, config);
      setPaper(result);
      saveQuestionsToBank(result.questions);
      
      setTimeout(() => {
        document.getElementById('practice-paper-container')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      setError(getErrorMessage(err, "生成练习卷失败。AI 老师可能需要休息一下，请稍后重试。"));
    } finally {
      setGenerating(false);
    }
  };

  const reset = () => {
    setAnalysis(null);
    setPaper(null);
    setError(null);
    setShowBank(false);
  };

  return (
    <div className="min-h-screen pb-20">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 no-print">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2" onClick={reset} style={{ cursor: 'pointer' }}>
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-xl font-bold text-gray-900">智学数学 <span className="text-sm font-normal text-gray-500 ml-1">小学卷子分析助手</span></h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowBank(true)}
              className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              我的题库
            </button>
            <button 
              onClick={reset}
              className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
            >
              重新开始
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pt-8">
        {!analysis && (
          <div className="max-w-3xl mx-auto text-center space-y-8 py-12">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">多卷分析，查漏补缺</h2>
              <p className="text-lg text-gray-600">
                上传多张已批改的数学试卷照片，AI 老师将为您深度挖掘知识盲区。
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-50">
               <FileUploader onAnalyze={handleAnalyze} isLoading={loading} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 text-red-800 px-6 py-4 rounded-xl shadow-sm flex items-start gap-3 animate-pulse">
                <svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-left">
                  <p className="font-bold">分析受阻</p>
                  <p className="text-sm opacity-90">{error}</p>
                </div>
              </div>
            )}
            
            <div className="grid grid-cols-3 gap-6 pt-8 no-print opacity-60">
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                </div>
                <h3 className="font-bold">多图上传</h3>
              </div>
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
                </div>
                <h3 className="font-bold">深度诊断</h3>
              </div>
              <div className="space-y-2 text-center">
                <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                </div>
                <h3 className="font-bold">提分练习</h3>
              </div>
            </div>
          </div>
        )}

        {analysis && (
          <div className="no-print">
            <AnalysisDisplay 
              result={analysis} 
              onGeneratePaper={handleGeneratePaper}
              isGenerating={generating}
            />
          </div>
        )}

        {paper && (
          <div id="practice-paper-container">
            <PracticePaper paper={paper} />
          </div>
        )}
      </main>

      {showBank && <QuestionBank onClose={() => setShowBank(false)} />}

      <footer className="mt-20 border-t border-gray-100 pt-8 text-center text-gray-400 text-sm no-print">
        <p>&copy; 2024 智学数学 - 基于 Gemini AI 的数学卷子分析助手</p>
      </footer>
    </div>
  );
};

export default App;