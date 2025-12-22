
import React, { useEffect, useState } from 'react';
import { GeneratedQuestion } from '../types';
import { getQuestionBank, clearQuestionBank, deleteFromBank } from '../services/storageService';

interface QuestionBankProps {
  onClose: () => void;
}

const QuestionBank: React.FC<QuestionBankProps> = ({ onClose }) => {
  const [bank, setBank] = useState<GeneratedQuestion[]>([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    setBank(getQuestionBank());
  }, []);

  const handleClear = () => {
    if (window.confirm('确定要清空所有已保存的题目吗？')) {
      clearQuestionBank();
      setBank([]);
    }
  };

  const handleDelete = (id: string) => {
    deleteFromBank(id);
    setBank(getQuestionBank());
  };

  const filteredBank = bank.filter(q => 
    q.question.includes(filter) || q.knowledgePoint.includes(filter)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 no-print">
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">个性化题库</h2>
            <p className="text-sm text-gray-500">已保存您历次生成的强化练习题目</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-4 bg-white border-b flex gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="搜索题目内容或知识点..." 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <button 
            onClick={handleClear}
            className="px-4 py-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition-colors font-medium whitespace-nowrap"
          >
            清空题库
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {filteredBank.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-400">题库空空如也，快去生成一些练习卷吧！</p>
            </div>
          ) : (
            filteredBank.map((q) => (
              <div key={q.id} className="border rounded-xl p-5 hover:border-blue-200 transition-colors group relative">
                <button 
                  onClick={() => handleDelete(q.id)}
                  className="absolute top-4 right-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                    {q.knowledgePoint}
                  </span>
                  <span className="text-xs text-gray-400">
                    {q.timestamp ? new Date(q.timestamp).toLocaleDateString() : ''}
                  </span>
                </div>
                <p className="text-gray-800 font-medium mb-3">{q.question}</p>
                {q.options && q.options.length > 0 && (
                  <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    {q.options.map((opt, i) => (
                      <div key={i}>{String.fromCharCode(65 + i)}. {opt}</div>
                    ))}
                  </div>
                )}
                <details className="text-sm">
                  <summary className="cursor-pointer text-blue-600 hover:text-blue-700 font-medium outline-none">查看答案与解析</summary>
                  <div className="mt-3 p-3 bg-green-50 rounded-lg text-green-800 border border-green-100">
                    <p className="font-bold">答案：{q.answer}</p>
                    <p className="mt-1 opacity-90"><span className="font-bold">解析：</span>{q.explanation}</p>
                  </div>
                </details>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;
