
import React, { useState } from 'react';

interface FileUploaderProps {
  onAnalyze: (base64Array: string[]) => void;
  isLoading: boolean;
}

interface ImageItem {
  id: string;
  base64: string;
  preview: string;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [images, setImages] = useState<ImageItem[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      // Fix: Explicitly type 'file' as File to avoid "unknown" type error when calling readAsDataURL
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string;
          const base64 = result.split(',')[1];
          setImages(prev => [
            ...prev,
            { id: Math.random().toString(36).substr(2, 9), base64, preview: result }
          ]);
        };
        reader.readAsDataURL(file);
      });
    }
    // Clear input so same file can be selected again if needed
    e.target.value = '';
  };

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map(img => (
          <div key={img.id} className="relative aspect-square rounded-xl overflow-hidden border border-gray-200 group shadow-sm">
            <img src={img.preview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              onClick={() => removeImage(img.id)}
              className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        
        <label className={`
          flex flex-col items-center justify-center aspect-square border-2 border-dashed rounded-xl cursor-pointer
          transition-colors duration-200
          ${isLoading ? 'bg-gray-100 border-gray-300' : 'bg-white border-blue-300 hover:bg-blue-50'}
        `}>
          <div className="flex flex-col items-center justify-center p-4 text-center">
            <svg className="w-8 h-8 mb-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-xs text-gray-700 font-semibold leading-tight">添加试卷照片</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            multiple
            onChange={handleFileChange}
            disabled={isLoading}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => onAnalyze(images.map(i => i.base64))}
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95
              ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                正在批量分析 {images.length} 张卷子...
              </span>
            ) : `开始分析这 ${images.length} 张卷子`}
          </button>
          <p className="text-xs text-gray-400">建议上传光线充足、字迹清晰的照片</p>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
