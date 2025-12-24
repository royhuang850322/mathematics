import React, { useState } from 'react';
import { AnalysisResult, PaperConfig } from '../types.ts';

interface AnalysisDisplayProps {
  result: AnalysisResult;
  onGeneratePaper: (config: PaperConfig) => void;
  isGenerating: boolean;
}

const AnalysisDisplay: React.FC<AnalysisDisplayProps> = ({ result, onGeneratePaper, isGenerating }) => {
  const [config, setConfig] = useState<PaperConfig>({
    count: 10,
    difficulty: '中等'
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-blue-500 rounded mr-3"></span>
          试卷诊断摘要
        </h2>
        <p className="text-gray-600 leading-relaxed bg-blue-50 p-4 rounded-lg">
          {result.overallSummary}
        </p>
      </section>

      <section>
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-red-500 rounded mr-3"></span>
          错题提取与分析
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {result.wrongQuestions.map((q) => (
            <div key={q.id} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                  q.difficulty === '简单' ? 'bg-green-100 text-green-700' : 
                  q.difficulty === '中等' ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                }`}>
                  难度: {q.difficulty}
                </span>
                <span className="text-blue-600 text-sm font-semibold">{q.knowledgePoint}</span>
              </div>
              <p className="text-gray-800 font-medium mb-3 italic">"{q.originalText}"</p>
              <div className="bg-gray-50 p-3 rounded text-sm text-gray-600">
                <span className="font-bold block mb-1">诊断分析:</span>
                {q.analysis}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
          <span className="w-2 h-6 bg-orange-500 rounded mr-3"></span>
          知识薄弱点汇总
        </h2>
        <div className="flex flex-wrap gap-2">
          {result.weakPoints.map((point, index) => (
            <span key={index} className="px-4 py-2 bg-orange-100 text-orange-800 rounded-full text-sm font-bold border border-orange-200">
              {point}
            </span>
          ))}
        </div>
      </section>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-blue-50 space-y-6">
        <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
          强化卷生成设置
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">题目数量 ({config.count} 题)</label>
            <input 
              type="range" 
              min="5" 
              max="15" 
              step="1" 
              value={config.count}
              onChange={(e) => setConfig({...config, count: parseInt(e.target.value)})}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">整体难度</label>
            <div className="flex bg-gray-100 p-1 rounded-lg">
              {(['简单', '中等', '困难'] as const).map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setConfig({...config, difficulty: lvl})}
                  className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${
                    config.difficulty === lvl 
                    ? 'bg-white text-blue-600 shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={() => onGeneratePaper(config)}
          disabled={isGenerating}
          className="w-full py-4 rounded-xl bg-blue-600 text-white font-bold"
        >
          {isGenerating ? '正在生成...' : '立刻生成强化练习卷'}
        </button>
      </div>
    </div>
  );
};

export default AnalysisDisplay;