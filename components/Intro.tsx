import React from 'react';
import { Microscope, Sparkles, ScanFace } from 'lucide-react';
import { Language } from '../types';

interface IntroProps {
  onStart: () => void;
  lang: Language;
}

const Intro: React.FC<IntroProps> = ({ onStart, lang }) => {
  const isEn = lang === 'en';

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-[75vh] py-10 text-center space-y-16 max-w-2xl mx-auto">
      <div className="space-y-8 animate-fade-in-up w-full">
        <div className="inline-flex items-center justify-center px-6 py-3 bg-red-50 text-[#B70033] rounded-full mb-4 border border-red-100 shadow-sm">
          <Sparkles className="w-8 h-8 mr-3" />
          <span className="font-bold text-xl">POSTECH AI Future Lab</span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tight leading-tight break-keep">
          {isEn ? (
            <>
              What kind of<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B70033] to-red-600">
                 researcher
              </span> are you?
            </>
          ) : (
            <>
              당신은 미래의<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B70033] to-red-600">
                 어떤 연구자일까요?
              </span>
            </>
          )}
        </h1>
        <p className="text-2xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          {isEn 
            ? "AI analyzes your expression to find the best matching POSTECH department for you."
            : "AI가 표정을 분석하여 가장 잘 어울리는 POSTECH 학과를 매칭해드립니다."
          }
        </p>
      </div>

      {/* Features - Vertical Stack for Portrait Monitor */}
      <div className="grid grid-cols-1 gap-6 w-full">
        <FeatureCard 
          icon={<ScanFace className="w-10 h-10 text-[#B70033]" />}
          title={isEn ? "Face Analysis" : "표정 분석"}
          desc={isEn 
            ? "Reads academic tendencies and inquiry styles from subtle expressions." 
            : "미세한 표정에서 드러나는 학문적 성향과 탐구 스타일을 읽어냅니다."
          }
        />
        <FeatureCard 
          icon={<Microscope className="w-10 h-10 text-red-500" />}
          title={isEn ? "Department Match" : "학과 매칭"}
          desc={isEn 
            ? "Suggests the best major at POSTECH based on your analyzed traits." 
            : "분석된 성향을 기반으로 POSTECH 학과 중 가장 잘 맞는 전공을 제안합니다."
          }
        />
        <FeatureCard 
          icon={<Sparkles className="w-10 h-10 text-orange-500" />}
          title={isEn ? "Student ID" : "학생증 발급"}
          desc={isEn 
            ? "Get a special student ID card with your future self." 
            : "미래 모습이 담긴 특별한 학생증을 발급받으세요."
          }
        />
      </div>

      <div className="w-full pt-8">
        <button
          onClick={onStart}
          className="group relative w-full max-w-lg inline-flex items-center justify-center px-12 py-8 text-4xl font-bold text-white transition-all duration-200 bg-[#B70033] rounded-full hover:bg-[#98002B] hover:shadow-2xl hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-offset-4 focus:ring-[#B70033] shadow-xl"
        >
          <span>{isEn ? "Start" : "시작하기"}</span>
          <ScanFace className="ml-4 w-10 h-10 group-hover:rotate-12 transition-transform" />
          <div className="absolute inset-0 rounded-full ring-4 ring-white/30 group-hover:ring-white/50 animate-pulse"></div>
        </button>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; desc: string }> = ({ icon, title, desc }) => (
  <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 hover:shadow-lg transition-shadow flex items-center text-left gap-6 w-full">
    <div className="bg-slate-50 w-20 h-20 rounded-2xl flex-shrink-0 flex items-center justify-center">
      {icon}
    </div>
    <div>
      <h3 className="text-2xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-lg leading-relaxed">{desc}</p>
    </div>
  </div>
);

export default Intro;