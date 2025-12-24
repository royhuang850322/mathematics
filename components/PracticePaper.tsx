import React from 'react';
import { GeneratedPaper } from '../types.ts';

interface PracticePaperProps {
  paper: GeneratedPaper;
}

const PracticePaper: React.FC<PracticePaperProps> = ({ paper }) => {
  return (
    <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg border border-gray-100 max-w-4xl mx-auto mt-10">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900 border-b-2 border-gray-900 pb-4 inline-block">
          {paper.title}
        </h1>
      </div>

      <div className="space-y-10">
        {paper.questions.map((q, idx) => (
          <div key={q.id} className="relative group">
            <div className="flex items-start gap-4">
              <span className="bg-gray-800 text-white w-8 h-8 flex items-center justify-center rounded-full flex-shrink-0 text-sm font-bold">
                {idx + 1}
              </span>
              <div className="flex-grow">
                <p className="text-lg text-gray-800 mb-4 leading-relaxed font-medium">
                  {q.question}
                </p>
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 pl-2">
                    {q.options.map((opt, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-gray-400 font-bold">{String.fromCharCode(65 + i)}.</span>
                        <span className="text-gray-700">{opt}</span>
                      </div>
                    ))}
                  </div>
                )}
                <div className="h-24 border-b border-dashed border-gray-300"></div>
                
                <div className="mt-6 p-4 bg-green-50 rounded-lg text-sm border border-green-100 no-print opacity-30 group-hover:opacity-100 transition-opacity">
                  <p className="font-bold text-green-800">答案: {q.answer}</p>
                  <p className="text-green-700 mt-1">解析: {q.explanation}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center no-print">
        <button
          onClick={() => window.print()}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg font-bold"
        >
          打印此试卷
        </button>
      </div>
    </div>
  );
};

export default PracticePaper;