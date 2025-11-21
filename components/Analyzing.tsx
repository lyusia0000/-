import React from 'react';
import { Language } from '../types';

interface AnalyzingProps {
    lang: Language;
}

const Analyzing: React.FC<AnalyzingProps> = ({ lang }) => {
  const isEn = lang === 'en';
  
  return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-center relative overflow-hidden w-full">
      <div className="relative w-48 h-48 mb-16">
        {/* Core pulsing circle */}
        <div className="absolute inset-0 bg-[#B70033] rounded-full opacity-20 animate-ping"></div>
        <div className="absolute inset-0 border-8 border-[#B70033] rounded-full animate-spin-slow border-t-transparent border-l-transparent"></div>
        <div className="absolute inset-4 border-8 border-red-400 rounded-full animate-spin-reverse border-b-transparent border-r-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl font-black text-slate-800 animate-pulse">AI</span>
        </div>
      </div>
      
      <h2 className="text-4xl font-black text-slate-800 mb-4 animate-pulse">
        {isEn ? "Analyzing..." : "표정 분석 중..."}
      </h2>
      <p className="text-2xl text-slate-500 mb-12 font-medium">
        {isEn ? "Finding matching POSTECH department." : "당신의 잠재력에 맞는 POSTECH 학과를 찾고 있습니다."}
      </p>

      <div className="w-96 h-4 bg-slate-200 rounded-full overflow-hidden shadow-inner">
        <div className="h-full bg-gradient-to-r from-[#B70033] to-red-600 animate-progress-bar"></div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-30">
         <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-red-400 rounded-full animate-ping delay-100"></div>
         <div className="absolute bottom-1/3 right-1/4 w-6 h-6 bg-[#B70033] rounded-full animate-ping delay-300"></div>
         <div className="absolute top-1/2 right-1/3 w-3 h-3 bg-orange-400 rounded-full animate-ping delay-500"></div>
      </div>
    </div>
  );
};

export default Analyzing;