import React, { useState } from 'react';
import { AppStep, AnalysisResult, Language } from './types';
import Intro from './components/Intro';
import CameraCapture from './components/CameraCapture';
import Analyzing from './components/Analyzing';
import ResultCard from './components/ResultCard';
import { analyzeImage, generateCaricature } from './services/geminiService';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('intro');
  const [imageData, setImageData] = useState<string>("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [caricatureData, setCaricatureData] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lang, setLang] = useState<Language>('ko');

  const handleStart = () => {
    setStep('capture');
    setError(null);
    setCaricatureData(null);
  };

  const handleCapture = async (base64Image: string) => {
    setImageData(base64Image);
    setStep('analyzing');
    
    try {
      // Run analysis and caricature generation in parallel
      const [analysisResponse, caricatureResponse] = await Promise.allSettled([
        analyzeImage(base64Image, lang),
        generateCaricature(base64Image)
      ]);

      if (analysisResponse.status === 'fulfilled') {
        setResult(analysisResponse.value);
      } else {
        throw analysisResponse.reason;
      }

      if (caricatureResponse.status === 'fulfilled') {
        setCaricatureData(caricatureResponse.value);
      } else {
        console.warn("Caricature generation failed:", caricatureResponse.reason);
        // We don't fail the whole flow if just the image gen fails, 
        // ResultCard handles the fallback to the original image.
      }

      setStep('result');
    } catch (err) {
      console.error(err);
      setError(lang === 'en' ? "An error occurred during analysis." : "분석 중 오류가 발생했습니다. 다시 시도해주세요.");
      setStep('error');
    }
  };

  const handleRetry = () => {
    setStep('intro');
    setImageData("");
    setResult(null);
    setCaricatureData(null);
    setError(null);
  };

  const toggleLanguage = () => {
    setLang(prev => prev === 'ko' ? 'en' : 'ko');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative font-sans selection:bg-red-500 selection:text-white overflow-x-hidden">
      {/* Header - Kiosk Optimized (Larger) */}
      <header className="fixed top-0 left-0 right-0 h-32 glass-panel z-50 flex items-center justify-between px-8 shadow-sm print:hidden">
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => setStep('intro')}>
          <div className="w-16 h-16 bg-[#B70033] rounded-2xl flex items-center justify-center text-white text-3xl font-black shadow-md">P</div>
          <div className="flex flex-col justify-center">
            <span className="leading-none text-3xl font-black text-slate-900 tracking-tight">POSTECH</span>
            <span className="font-light text-slate-500 text-lg leading-none tracking-wide">AI Future Lab</span>
          </div>
        </div>

        <button 
          onClick={toggleLanguage}
          className="h-20 px-10 rounded-full bg-white border-2 border-slate-200 shadow-lg flex items-center gap-6 text-2xl font-bold hover:border-[#B70033]/30 hover:shadow-xl active:scale-95 transition-all"
        >
          <span className={`transition-all duration-200 ${lang === 'ko' ? 'text-[#B70033] scale-110 font-black' : 'text-slate-300'}`}>한국어</span>
          <div className="w-px h-8 bg-slate-200"></div>
          <span className={`transition-all duration-200 ${lang === 'en' ? 'text-[#B70033] scale-110 font-black' : 'text-slate-300'}`}>English</span>
        </button>
      </header>

      {/* Main Content - Adjusted padding for larger header */}
      <main className="flex-1 pt-40 px-6 md:px-10 flex flex-col items-center w-full max-w-5xl mx-auto print:pt-0 print:px-0 print:w-full pb-20">
        {step === 'intro' && <Intro onStart={handleStart} lang={lang} />}
        
        {step === 'capture' && (
          <div className="w-full animate-fade-in print:hidden flex flex-col items-center">
             <h2 className="text-center text-4xl font-bold mb-10 text-slate-800">
               {lang === 'en' ? "Please look at the camera" : "정면을 바라봐주세요"}
             </h2>
             <CameraCapture onCapture={handleCapture} onBack={() => setStep('intro')} lang={lang} />
          </div>
        )}

        {step === 'analyzing' && <Analyzing lang={lang} />}

        {step === 'result' && result && (
          <ResultCard 
            result={result} 
            userImage={imageData} 
            caricatureImage={caricatureData || undefined}
            onRetry={handleRetry}
            lang={lang}
          />
        )}

        {step === 'error' && (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
            <div className="w-24 h-24 bg-red-100 text-red-500 rounded-full flex items-center justify-center text-5xl font-bold shadow-sm">!</div>
            <h3 className="text-3xl font-bold text-slate-900">{lang === 'en' ? "Error Occurred" : "오류가 발생했습니다"}</h3>
            <p className="text-slate-600 max-w-lg text-xl">{error}</p>
            <button 
              onClick={handleRetry}
              className="px-12 py-6 bg-slate-900 text-white text-2xl font-bold rounded-full hover:bg-slate-800 transition shadow-lg"
            >
              {lang === 'en' ? "Back to Start" : "처음으로 돌아가기"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;