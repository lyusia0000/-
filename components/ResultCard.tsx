import React, { useRef, useState } from 'react';
import { AnalysisResult, DEPARTMENT_DATA, Language } from '../types';
import { Mail, RotateCcw, Printer, Quote, GraduationCap, Loader2 } from 'lucide-react';

interface ResultCardProps {
  result: AnalysisResult;
  userImage: string;
  caricatureImage?: string;
  onRetry: () => void;
  lang: Language;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, userImage, caricatureImage, onRetry, lang }) => {
  const isEn = lang === 'en';
  const idCardRef = useRef<HTMLDivElement>(null);
  const [isGeneratingEmail, setIsGeneratingEmail] = useState(false);

  const handleDirectPrint = () => {
    if (!idCardRef.current) return;

    // Create a hidden iframe for printing
    const iframe = document.createElement('iframe');
    iframe.style.position = 'absolute';
    iframe.style.width = '0px';
    iframe.style.height = '0px';
    iframe.style.border = 'none';
    document.body.appendChild(iframe);

    const content = idCardRef.current.outerHTML;

    // Copy current styles
    const styles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(node => node.outerHTML)
      .join('');

    const doc = iframe.contentDocument || iframe.contentWindow?.document;
    if (doc) {
      doc.open();
      doc.write(`
        <!DOCTYPE html>
        <html>
          <head>
            ${styles}
            <script src="https://cdn.tailwindcss.com"></script>
            <style>
              @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;700;900&display=swap');
              @page {
                size: 100mm 150mm;
                margin: 0;
              }
              html, body {
                width: 100mm;
                height: 150mm;
                margin: 0;
                padding: 0;
                overflow: hidden;
              }
              body {
                transform: scale(0.4); /* Requested 40% scale */
                transform-origin: top left;
                width: 250mm; /* Compensate width for scale down (100mm / 0.4) */
                height: 375mm; /* Compensate height for scale down */
              }
              * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              /* Ensure flex layouts work in print */
              .print\\:flex { display: flex !important; }
              .print\\:flex-col { flex-direction: column !important; }
              .print\\:hidden { display: none !important; }
            </style>
          </head>
          <body class="bg-white">
            ${content}
          </body>
        </html>
      `);
      doc.close();

      // Print once loaded
      iframe.onload = () => {
        setTimeout(() => {
          iframe.contentWindow?.focus();
          iframe.contentWindow?.print();
          // Clean up iframe after printing
          setTimeout(() => {
            document.body.removeChild(iframe);
          }, 1000);
        }, 500);
      };
    }
  };

  const handleEmail = async () => {
    if (!idCardRef.current) return;
    setIsGeneratingEmail(true);

    try {
      const canvas = await (window as any).html2canvas(idCardRef.current, {
        useCORS: true,
        scale: 2,
        backgroundColor: '#ffffff',
        allowTaint: true,
        logging: false
      });

      canvas.toBlob(async (blob: Blob | null) => {
        if (!blob) {
          throw new Error("Failed to generate image");
        }

        const fileName = `POSTECH_FUTURE_ID_${Date.now()}.png`;
        const file = new File([blob], fileName, { type: "image/png" });

        const shareData = {
          files: [file],
          title: isEn ? 'My Future Researcher ID' : '나의 미래 연구자 ID',
          text: isEn 
            ? `Check out my future researcher analysis result! \nDepartment: ${result.studentId.department}`
            : `저의 미래 연구자 분석 결과를 확인해보세요! \n매칭 학과: ${result.studentId.department}`,
        };

        if (navigator.canShare && navigator.canShare(shareData)) {
          try {
            await navigator.share(shareData);
          } catch (err) {
            console.log("Share cancelled or failed", err);
          }
        } else {
          const link = document.createElement('a');
          link.href = canvas.toDataURL("image/png");
          link.download = fileName;
          link.click();

          alert(isEn 
            ? "The ID Card image has been downloaded.\nPlease attach it manually to the email." 
            : "학생증 이미지가 다운로드되었습니다.\n이메일 작성 시 이미지를 첨부해주세요."
          );

          const subject = isEn 
            ? `[POSTECH AI Future Lab] My Future Research Field: ${result.studentId.department}` 
            : `[POSTECH AI Future Lab] 나의 미래 연구 분야: ${result.studentId.department}`;
            
          const body = isEn 
            ? `I just analyzed my future potential at POSTECH!\n\nDepartment Match: ${result.studentId.department}\nKey Traits: ${result.studentId.keyTraits.join(', ')}\n\n"${result.studentId.bottomLine}"`
            : `POSTECH에서 저의 미래 잠재력을 분석했습니다!\n\n매칭 학과: ${result.studentId.department}\n핵심 성향: ${result.studentId.keyTraits.join(', ')}\n\n"${result.studentId.bottomLine}"`;
          
          window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        }
        
        setIsGeneratingEmail(false);
      }, 'image/png');

    } catch (err) {
      console.error("Error generating email image:", err);
      setIsGeneratingEmail(false);
      const subject = isEn 
        ? `[POSTECH AI Future Lab] My Future Research Field: ${result.studentId.department}` 
        : `[POSTECH AI Future Lab] 나의 미래 연구 분야: ${result.studentId.department}`;
      const body = isEn 
        ? `I just analyzed my future potential at POSTECH!\n\nDepartment Match: ${result.studentId.department}\nKey Traits: ${result.studentId.keyTraits.join(', ')}\n\n"${result.studentId.bottomLine}"`
        : `POSTECH에서 저의 미래 잠재력을 분석했습니다!\n\n매칭 학과: ${result.studentId.department}\n핵심 성향: ${result.studentId.keyTraits.join(', ')}\n\n"${result.studentId.bottomLine}"`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  const mainImageSrc = caricatureImage ? `data:image/jpeg;base64,${caricatureImage}` : `data:image/jpeg;base64,${userImage}`;
  
  const matchedDept = DEPARTMENT_DATA.find(d => result.studentId.department.includes(d.name) || result.studentId.department.includes(d.englishName)) || 
                      DEPARTMENT_DATA.find(d => d.name === "IT융합공학과"); 
  
  const qrCodeUrl = matchedDept ? `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(matchedDept.url)}` : '';

  const description = matchedDept ? (isEn ? matchedDept.descriptionEn : matchedDept.description) : "";

  return (
    <div className="w-full max-w-2xl mx-auto p-4 animate-fade-in-up pb-20 print:p-0 print:m-0 print:w-[100mm] print:h-[150mm] print:max-w-none print:animate-none flex flex-col items-center">
      
      {/* Intro Message Bubble */}
      <div className="mb-10 text-center animate-fade-in-up print:hidden w-full">
         <div className="inline-block bg-slate-900 text-white px-8 py-4 rounded-full shadow-xl">
            <SparklesIcon className="w-6 h-6 inline-block mr-3 text-yellow-400" />
            <span className="font-bold text-xl">{result.introMessage}</span>
         </div>
      </div>

      {/* Print Content Wrapper - No Padding for Print to Fill 10x15cm */}
      <div className="bg-white w-full h-full print:flex print:flex-col print:h-full print:justify-between">

        {/* ID Card Visual - Kiosk (Tall) & Print (10x15cm) */}
        <div ref={idCardRef} className="relative w-full perspective-1000 mb-12 print:perspective-none print:mb-0 bg-white p-2 rounded-[2.5rem] shadow-sm print:p-0 print:rounded-none print:shadow-none print:h-full">
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border-2 border-slate-200 print:shadow-none print:border-0 print:rounded-none relative flex flex-col h-full">
            
            {/* Top Bar - Red */}
            <div className="h-28 bg-[#B70033] relative overflow-hidden print:h-[2.5cm] flex-shrink-0">
               <div className="absolute -right-10 -top-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
               <div className="absolute left-10 top-10 w-20 h-20 bg-black opacity-10 rounded-full blur-xl"></div>
               <div className="absolute bottom-5 left-8 z-10 text-white print:left-4 print:bottom-3">
                  <p className="text-sm font-medium tracking-widest opacity-90 uppercase mb-1 print:text-[8px] print:mb-0.5">Pohang University of Science and Technology</p>
                  <h2 className="text-4xl font-black tracking-tighter print:text-2xl">POSTECH</h2>
               </div>
               <div className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 print:top-3 print:right-3 print:px-2 print:py-1">
                 <GraduationCap className="w-5 h-5 text-white print:w-3 print:h-3" />
                 <span className="text-sm font-bold text-white uppercase print:text-[8px]">Student ID</span>
               </div>
            </div>

            {/* Card Body - Stacked */}
            <div className="p-8 md:p-10 flex flex-col gap-8 items-center text-center print:p-4 print:gap-3 print:flex-1">
               
               {/* Photo Section */}
               <div className="flex-shrink-0 flex flex-col items-center space-y-4 print:space-y-2">
                 <div className="w-64 h-80 bg-slate-100 rounded-2xl overflow-hidden border-4 border-slate-200 shadow-inner relative print:w-[5cm] print:h-[6.5cm] print:border-2 print:rounded-lg">
                    <img 
                      src={mainImageSrc} 
                      alt="Student Portrait" 
                      className={`w-full h-full object-cover ${caricatureImage ? '' : 'transform -scale-x-100'}`}
                    />
                 </div>
                 <div className="print:hidden">
                    <div className="inline-block px-4 py-2 bg-slate-100 text-slate-600 text-sm font-bold rounded-full uppercase tracking-wider border border-slate-200">
                      Future Researcher
                    </div>
                 </div>
               </div>

               {/* Info Section */}
               <div className="flex-1 space-y-6 w-full print:pt-0 print:space-y-2 flex flex-col">
                 <div className="border-b-2 border-slate-100 pb-6 print:pb-2 print:border-slate-100">
                   <div className="text-sm text-[#B70033] font-bold uppercase tracking-wider mb-2 print:text-[10px] print:mb-0">Department Match</div>
                   <h3 className="text-4xl font-black text-slate-900 leading-tight break-keep print:text-xl print:leading-tight">
                     {result.studentId.department}
                   </h3>
                   {matchedDept && (
                     <p className="text-lg font-semibold text-slate-400 uppercase tracking-tight mt-2 print:text-[10px] print:mt-0.5">
                       {matchedDept.englishName}
                     </p>
                   )}
                 </div>

                 <div className="flex flex-col gap-6 print:gap-2 print:flex-1">
                    {/* AI Analysis */}
                    <div className="print:flex-shrink-0">
                       <div className="flex flex-wrap gap-3 justify-center print:gap-1.5">
                          {result.studentId.keyTraits.map((trait, i) => (
                            <span key={i} className="px-4 py-2 bg-[#B70033]/5 text-[#B70033] font-bold rounded-lg text-lg print:text-[9px] print:px-2 print:py-0.5 print:border-[0.5px] print:border-slate-200">
                              #{trait}
                            </span>
                          ))}
                       </div>
                    </div>

                    {/* Department Description & QR */}
                    {matchedDept && (
                      <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col gap-4 print:bg-white print:border-0 print:p-0 print:flex-row print:items-center print:gap-3 print:mt-auto">
                          <div className="flex-1 hidden print:block">
                             <p className="text-slate-600 text-xs leading-tight text-justify print:text-[9px] print:leading-snug line-clamp-3">
                               {description}
                             </p>
                             {result.studentId.reason && (
                               <p className="text-[#B70033] text-xs font-bold mt-1 text-justify print:text-[8px] print:mt-0.5 print:leading-snug line-clamp-2">
                                  {result.studentId.reason}
                               </p>
                             )}
                          </div>
                          <div className="flex-shrink-0 flex flex-col items-center gap-2 mx-auto print:mx-0 print:gap-1">
                             <div className="w-24 h-24 bg-white p-2 rounded-xl border border-slate-200 print:w-[1.8cm] print:h-[1.8cm] print:p-1 print:border-[0.5px]">
                                <img 
                                  src={qrCodeUrl} 
                                  alt="Department QR" 
                                  className="w-full h-full" 
                                  crossOrigin="anonymous"
                                />
                             </div>
                          </div>
                      </div>
                    )}
                 </div>
               </div>
            </div>

            {/* Bottom Bar */}
            <div className="bg-slate-50 px-8 py-6 border-t border-slate-100 flex flex-col gap-6 print:bg-white print:border-t print:border-slate-200 print:py-2 print:px-4 print:gap-2 flex-shrink-0">
               <div className="flex items-start gap-3 justify-center print:gap-2">
                  <Quote className="w-6 h-6 text-[#B70033] flex-shrink-0 mt-1 print:w-3 print:h-3 print:mt-0.5" />
                  <p className="text-lg font-bold text-slate-800 italic print:text-[10px] print:leading-tight">"{result.studentId.bottomLine}"</p>
               </div>
               <div className="flex flex-col items-end w-full">
                  <div className="text-xs text-slate-400 uppercase tracking-widest font-bold text-right mb-1 w-full flex flex-col items-end gap-2 print:gap-0.5 print:text-[8px]">
                      <span className="mb-1 print:mb-0 flex items-center gap-2">
                        Authorized by 
                        <img src="https://i.imgur.com/7B8jW3R.png" alt="POSTECH1986" className="h-4 object-contain print:h-2" />
                      </span>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Action Buttons (Hidden in Print) */}
        <div className="flex flex-col gap-4 print:hidden w-full">
           <button 
             onClick={handleDirectPrint} 
             className="flex items-center justify-center gap-3 py-5 px-6 bg-[#B70033] text-white rounded-2xl hover:bg-[#98002B] font-bold text-xl transition shadow-md w-full active:scale-[0.98]"
           >
             <Printer className="w-6 h-6" />
             {isEn ? "Print ID Card" : "학생증 출력하기"}
           </button>
           
           <div className="grid grid-cols-2 gap-4">
              <button onClick={onRetry} className="flex items-center justify-center gap-3 py-5 px-6 bg-white border-2 border-slate-200 rounded-2xl hover:bg-slate-50 text-slate-600 font-bold text-lg transition shadow-md active:scale-[0.98]">
                <RotateCcw className="w-5 h-5" />
                {isEn ? "Retry" : "다시하기"}
              </button>
              <button 
                onClick={handleEmail} 
                disabled={isGeneratingEmail}
                className="flex items-center justify-center gap-3 py-5 px-6 bg-slate-900 text-white rounded-2xl hover:bg-slate-800 font-bold text-lg transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
              >
                {isGeneratingEmail ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                {isEn ? "Send Email" : "이메일 보내기"}
              </button>
           </div>
           
           {caricatureImage && (
             <div className="mt-6 text-center">
               <p className="text-sm text-slate-400">
                 {isEn ? "* This image is an AI-generated future caricature." : "* 위 이미지는 AI가 생성한 미래의 모습입니다."}
               </p>
             </div>
           )}
        </div>
      
      </div>
    </div>
  );
};

const SparklesIcon = ({ className }: { className?: string }) => (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M9.857 1.464a1.008 1.008 0 0 1 1.949.091l.016.203.866 10.392 10.392.866a1.008 1.008 0 0 1 .091 1.949l-.203.016-10.392.866-.866 10.392a1.008 1.008 0 0 1-1.949-.091l-.016-.203-.866-10.392L1.125 14.25a1.008 1.008 0 0 1-.091-1.949l.203-.016 10.392-.866.866-10.392.146-1.748Z" /></svg>
);

export default ResultCard;