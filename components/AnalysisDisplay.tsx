
import React, { useState } from 'react';
import { AnalysisResult, PaperConfig } from '../types';

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
          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
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
            <div className="flex justify-between text-xs text-gray-500 px-1">
              <span>5</span>
              <span>10</span>
              <span>15</span>
            </div>
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

        <div className="flex justify-center pt-4">
          <button
            onClick={() => onGeneratePaper(config)}
            disabled={isGenerating}
            className={`
              w-full md:w-auto px-12 py-4 rounded-full text-white font-bold text-lg shadow-lg transform transition-all active:scale-95
              ${isGenerating ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
            `}
          >
            {isGenerating ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在生成专属练习卷...
              </span>
            ) : '立刻生成强化练习卷'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDisplay;
