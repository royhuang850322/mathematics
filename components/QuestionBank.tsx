import React, { useEffect, useState } from 'react';
import { GeneratedQuestion } from '../types.ts';
import { getQuestionBank, clearQuestionBank, deleteFromBank } from '../services/storageService.ts';

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
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        <div className="p-6 border-b flex items-center justify-between bg-gray-50">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">个性化题库</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full">
            关闭
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          {filteredBank.map((q) => (
            <div key={q.id} className="border rounded-xl p-5 group relative">
              <button 
                onClick={() => handleDelete(q.id)}
                className="absolute top-4 right-4 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                删除
              </button>
              <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full font-bold">
                {q.knowledgePoint}
              </span>
              <p className="text-gray-800 font-medium my-3">{q.question}</p>
              <details className="text-sm">
                <summary className="cursor-pointer text-blue-600">查看答案</summary>
                <div className="mt-2 p-3 bg-green-50 rounded-lg text-green-800">
                  答案：{q.answer}
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionBank;