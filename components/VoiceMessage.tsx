import React, { useState, useEffect, useRef } from 'react';
import { Mic, Square, Send, RefreshCw, MapPin } from 'lucide-react';
import { Station } from '../types';

interface VoiceMessageProps {
  station: Station;
}

type RecorderState = 'IDLE' | 'RECORDING' | 'REVIEW' | 'SENDING' | 'SENT';

const VoiceMessage: React.FC<VoiceMessageProps> = ({ station }) => {
  const [state, setState] = useState<RecorderState>('IDLE');
  const [duration, setDuration] = useState(0);
  const [bars, setBars] = useState<number[]>(new Array(20).fill(10));
  const timerRef = useRef<number | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const startRecording = () => {
    setState('RECORDING');
    setDuration(0);

    // Timer
    timerRef.current = window.setInterval(() => {
      setDuration(prev => {
        if (prev >= 60) {
          stopRecording();
          return 60;
        }
        return prev + 1;
      });
    }, 1000);

    // Fake Waveform Animation
    const animate = () => {
      setBars(prev => prev.map(() => Math.floor(Math.random() * 80) + 10));
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (animationRef.current) cancelAnimationFrame(animationRef.current);
    setState('REVIEW');
    setBars(new Array(20).fill(10)); // Reset visualizer
  };

  const sendRecording = () => {
    setState('SENDING');
    setTimeout(() => {
      setState('SENT');
    }, 2000);
  };

  const reset = () => {
    setState('IDLE');
    setDuration(0);
  };

  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full items-center justify-center p-6 animate-in fade-in duration-500">

      {state === 'IDLE' && (
        <div className="text-center space-y-6">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mic size={48} className="text-gray-400" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">A bar mana sakon murya</h3>
          <p className="text-gray-500 max-w-[250px] mx-auto text-sm">
            Record a message up to 60 seconds. It will be compressed to save data.
          </p>
          <button
            onClick={startRecording}
            className="w-full py-4 rounded-full font-bold text-white shadow-lg active:scale-95 transition-transform"
            style={{ backgroundColor: station.primaryColor }}
          >
            TAP TO RECORD
          </button>
        </div>
      )}

      {state === 'RECORDING' && (
        <div className="w-full flex flex-col items-center">
          <div className="text-4xl font-mono font-bold text-gray-800 mb-8 tabular-nums">
            {formatTime(duration)} <span className="text-gray-300 text-2xl">/ 01:00</span>
          </div>

          {/* Waveform */}
          <div className="flex items-center justify-center gap-1 h-24 w-full mb-12">
            {bars.map((height, i) => (
              <div
                key={i}
                className="w-2 bg-gray-800 rounded-full transition-all duration-75"
                style={{
                  height: `${height}%`,
                  backgroundColor: station.primaryColor
                }}
              />
            ))}
          </div>

          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-red-500 flex items-center justify-center shadow-lg animate-pulse"
          >
            <Square size={32} className="text-white fill-current" />
          </button>
        </div>
      )}

      {state === 'REVIEW' && (
        <div className="w-full space-y-6">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <span className="font-bold text-gray-700">Message Ready</span>
              <span className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-600 font-mono">~32KB</span>
            </div>
            <div className="h-1 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gray-500 w-full" style={{ backgroundColor: station.primaryColor }}></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 bg-white p-2 rounded border border-gray-100">
              <MapPin size={16} />
              <select className="bg-transparent w-full focus:outline-none">
                <option>Kano State</option>
                <option>Jigawa State</option>
                <option>Kaduna State</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={reset}
              className="py-3 rounded-lg border-2 border-gray-200 font-bold text-gray-500 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} /> Retry
            </button>
            <button
              onClick={sendRecording}
              className="py-3 rounded-lg font-bold text-white flex items-center justify-center gap-2 shadow-md"
              style={{ backgroundColor: station.primaryColor }}
            >
              <Send size={18} /> Send
            </button>
          </div>
        </div>
      )}

      {state === 'SENDING' && (
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" style={{ borderTopColor: station.primaryColor }}></div>
          <p className="font-medium text-gray-600">Compressing & Uploading...</p>
        </div>
      )}

      {state === 'SENT' && (
        <div className="text-center animate-in zoom-in duration-300">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 text-green-600">
            <Check size={40} strokeWidth={4} />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">Godiya!</h3>
          <p className="text-gray-500 mb-8">Your message has been sent to {station.name}.</p>
          <button
            onClick={reset}
            className="text-gray-500 font-medium underline"
          >
            Record another
          </button>
        </div>
      )}

    </div>
  );
};

// Helper for check icon
const Check = ({ size, strokeWidth }: { size: number, strokeWidth: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
)

export default VoiceMessage;