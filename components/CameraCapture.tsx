import React, { useRef, useState, useCallback, useEffect } from 'react';
import { Camera, Upload, RefreshCcw, Aperture } from 'lucide-react';
import { Language } from '../types';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onBack: () => void;
  lang: Language;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onBack, lang }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string>("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  const isEn = lang === 'en';

  useEffect(() => {
    let currentStream: MediaStream | null = null;
    let isMounted = true;

    const initCamera = async () => {
      setError("");
      setIsCameraReady(false);

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        if (isMounted) setError(isEn ? "Camera API not supported" : "카메라 기능을 지원하지 않는 브라우저입니다.");
        return;
      }

      try {
        // Step 1: Check if any video devices exist
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        
        if (videoDevices.length === 0) {
            throw new Error("No video input devices found");
        }

        let mediaStream: MediaStream | null = null;

        // Step 2: Try Kiosk Portrait Constraints (1080x1920)
        if (!mediaStream) {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user", width: { ideal: 1080 }, height: { ideal: 1920 } },
                    audio: false,
                });
            } catch (e) {
                console.warn("Portrait constraints failed.");
            }
        }

        // Step 3: Try Basic User Facing
        if (!mediaStream) {
            try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" },
                    audio: false,
                });
            } catch (e) {
                console.warn("User facing constraint failed.");
            }
        }

        // Step 4: Try Any Video Device (Fallback)
        if (!mediaStream) {
             try {
                mediaStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: false,
                });
             } catch (e) {
                 console.warn("Basic video request failed.");
             }
        }
        
        if (!mediaStream) {
            throw new Error("Could not initialize any camera.");
        }

        if (!isMounted) {
          mediaStream.getTracks().forEach(track => track.stop());
          return;
        }

        currentStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
          videoRef.current.onloadedmetadata = () => {
            if (isMounted) {
              setIsCameraReady(true);
              videoRef.current?.play().catch(e => console.error("Play error:", e));
            }
          };
        }

      } catch (err: any) {
        console.error("Final camera access error:", err);
        if (!isMounted) return;

        let errorMessage = isEn 
          ? "Cannot access camera. Please upload a photo." 
          : "카메라에 접근할 수 없습니다. 사진을 업로드해주세요.";
        
        if (err.name === 'NotFoundError' || err.message?.includes('No video input') || err.message?.includes('not found')) {
           errorMessage = isEn 
             ? "No camera found. Please upload a photo." 
             : "카메라를 찾을 수 없습니다. 사진을 업로드해주세요.";
        } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
           errorMessage = isEn 
             ? "Camera permission denied." 
             : "카메라 권한이 거부되었습니다.";
        } else if (err.name === 'NotReadableError') {
           errorMessage = isEn 
             ? "Camera is in use by another app." 
             : "카메라가 다른 앱에서 사용 중입니다.";
        }

        setError(errorMessage);
      }
    };

    initCamera();

    return () => {
      isMounted = false;
      if (currentStream) {
        currentStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isEn]);

  const executeCapture = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      if (video.videoWidth === 0 || video.videoHeight === 0) return;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(video, 0, 0);
        
        try {
          const imageData = canvas.toDataURL('image/jpeg', 0.85);
          const base64 = imageData.split(',')[1];
          onCapture(base64);
        } catch (e) {
          console.error("Capture error:", e);
        }
      }
    }
  }, [onCapture]);

  useEffect(() => {
    if (countdown === null) return;

    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => (prev !== null ? prev - 1 : null));
      }, 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      executeCapture();
      setCountdown(null);
    }
  }, [countdown, executeCapture]);

  const handleCaptureClick = () => {
    setCountdown(5);
  };

  const handleRetryCamera = () => {
     window.location.reload();
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onCapture(base64);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-3xl mx-auto p-4 gap-8">
      {/* Camera Preview Container - Portrait 9:16 Aspect Ratio */}
      <div className="w-full bg-black rounded-[3rem] overflow-hidden shadow-2xl relative aspect-[9/16] group border-4 border-slate-900">
        {!isCameraReady && !error && (
           <div className="absolute inset-0 flex items-center justify-center text-white/50">
             <p className="text-2xl">{isEn ? "Connecting camera..." : "카메라 연결 중..."}</p>
           </div>
        )}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-slate-300 p-6 text-center">
            <p className="mb-6 font-bold text-red-400 text-xl">{error}</p>
            <label className="cursor-pointer px-8 py-4 bg-[#B70033] text-white text-xl rounded-full hover:bg-[#98002B] transition shadow-lg active:scale-95">
              <Upload className="inline-block w-6 h-6 mr-3" />
              {isEn ? "Upload Photo" : "사진 업로드하기"}
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="w-full h-full object-cover transform -scale-x-100"
              playsInline
              muted
              autoPlay
            />
            {/* Overlay Guidelines - Portrait Shape */}
            <div className="absolute inset-0 pointer-events-none">
               <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[40%] border-2 border-white/30 rounded-[50%]"></div>
               <div className="absolute top-8 left-8 w-12 h-12 border-t-8 border-l-8 border-[#B70033]/70 rounded-tl-xl"></div>
               <div className="absolute top-8 right-8 w-12 h-12 border-t-8 border-r-8 border-[#B70033]/70 rounded-tr-xl"></div>
               <div className="absolute bottom-8 left-8 w-12 h-12 border-b-8 border-l-8 border-[#B70033]/70 rounded-bl-xl"></div>
               <div className="absolute bottom-8 right-8 w-12 h-12 border-b-8 border-r-8 border-[#B70033]/70 rounded-br-xl"></div>
            </div>
            
            {/* Countdown Overlay */}
            {countdown !== null && countdown > 0 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[4px] z-20">
                 <span className="text-[12rem] font-black text-white animate-pulse drop-shadow-2xl font-mono">
                    {countdown}
                 </span>
              </div>
            )}
          </>
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="flex flex-col items-center gap-8 w-full justify-center pb-8">
        {isCameraReady && !error && (
          <button
            onClick={handleCaptureClick}
            disabled={countdown !== null}
            className="group relative w-28 h-28 flex items-center justify-center bg-white rounded-full shadow-2xl hover:shadow-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
             <div className="absolute inset-1.5 rounded-full border-4 border-slate-200 group-hover:border-red-200 transition-colors"></div>
             <div className="w-20 h-20 bg-[#B70033] rounded-full group-hover:bg-[#98002B] transition-colors"></div>
             <Aperture className="absolute w-10 h-10 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          </button>
        )}
        
        <div className="flex gap-6">
           <button
             onClick={onBack}
             className="px-10 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xl transition shadow-md"
           >
             {isEn ? "Back" : "뒤로가기"}
           </button>
           
           {!error && (
            <label className="cursor-pointer px-10 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-[#B70033] font-bold text-xl transition shadow-md flex items-center gap-3">
              <Upload className="w-6 h-6" />
              <span>{isEn ? "Upload" : "파일 업로드"}</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
           )}

           {error && (
              <button
              onClick={handleRetryCamera}
              className="px-10 py-4 rounded-full bg-white border-2 border-slate-200 text-slate-600 hover:bg-slate-50 font-bold text-xl transition shadow-md flex items-center gap-3"
            >
              <RefreshCcw className="w-6 h-6" />
              <span>{isEn ? "Retry" : "재시도"}</span>
            </button>
           )}
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;