import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Signal, Share2, Radio } from 'lucide-react';
import { Station } from '../types';

interface LivePlayerProps {
  station: Station;
  isPlaying: boolean;
  isBuffering: boolean;
  togglePlay: () => void;
  networkQuality: '2G' | '3G' | '4G';
}

const LivePlayer: React.FC<LivePlayerProps> = ({ 
  station, 
  isPlaying, 
  isBuffering, 
  togglePlay,
  networkQuality 
}) => {
  const [ticker, setTicker] = useState(0);

  // Simple marquee effect for "Now Playing"
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(prev => prev + 1);
    }, 50);
    return () => clearInterval(interval);
  }, []);

  const getSignalColor = () => {
    if (networkQuality === '2G') return 'text-red-500';
    if (networkQuality === '3G') return 'text-yellow-500';
    return 'text-green-500';
  };

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 animate-in fade-in duration-500">
      {/* Frequency Badge */}
      <div className={`px-4 py-1 rounded-full bg-opacity-10 mb-8 border border-gray-200 shadow-sm ${station.id === 'dutse_995' ? 'bg-black/5 text-black' : 'bg-gray-100 text-gray-800'}`}>
        <span className="font-bold text-lg tracking-widest">{station.frequency}</span>
      </div>

      {/* Main Play Button Circle */}
      <div className="relative mb-8">
        {/* Pulsing rings when playing */}
        {isPlaying && (
          <>
            <div className={`absolute inset-0 rounded-full opacity-20 animate-ping ${station.id === 'dutse_995' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ backgroundColor: station.primaryColor }}></div>
            <div className={`absolute -inset-4 rounded-full opacity-10 animate-pulse ${station.id === 'dutse_995' ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ backgroundColor: station.primaryColor, animationDuration: '2s' }}></div>
          </>
        )}

        <button
          onClick={togglePlay}
          className="relative z-10 w-40 h-40 rounded-full flex items-center justify-center shadow-xl transition-transform active:scale-95 bg-white"
          style={{ border: `4px solid ${station.primaryColor}` }}
          aria-label={isPlaying ? "Pause Stream" : "Play Stream"}
        >
          {isBuffering ? (
            <div className="w-12 h-12 border-4 border-t-transparent rounded-full animate-spin" style={{ borderColor: `${station.primaryColor} transparent transparent transparent` }}></div>
          ) : isPlaying ? (
            <Pause size={64} style={{ color: station.primaryColor, fill: station.primaryColor }} />
          ) : (
            <Play size={64} className="ml-2" style={{ color: station.primaryColor, fill: station.primaryColor }} />
          )}
        </button>
      </div>

      {/* Station Name & Location */}
      <h2 className="text-2xl font-bold mb-1 text-center">{station.name}</h2>
      <p className="text-sm font-medium text-gray-500 tracking-wider mb-6">{station.location} STATE</p>

      {/* Marquee / Status */}
      <div className="w-full bg-gray-100 rounded-lg p-3 mb-6 overflow-hidden relative border border-gray-200">
        <div className="whitespace-nowrap font-medium text-gray-700 flex items-center justify-center">
           {isPlaying ? (
             <span className="flex items-center gap-2">
               <span className="relative flex h-3 w-3">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${getSignalColor()} bg-current`}></span>
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${getSignalColor()} bg-current`}></span>
                </span>
               LIVE: Muryar Jama'a (Voice of the People)
             </span>
           ) : (
             "Tap play to start listening"
           )}
        </div>
      </div>

      {/* Network & Controls */}
      <div className="flex items-center justify-between w-full max-w-xs px-4">
        <div className="flex flex-col items-center gap-1">
          <div className="flex items-end gap-1 h-5">
            <div className={`w-1 bg-gray-300 rounded-t ${networkQuality !== '2G' ? 'h-full ' + getSignalColor().replace('text', 'bg') : 'h-2 bg-red-500'}`}></div>
            <div className={`w-1 bg-gray-300 rounded-t ${networkQuality === '4G' ? 'h-full ' + getSignalColor().replace('text', 'bg') : 'h-3'}`}></div>
            <div className={`w-1 bg-gray-300 rounded-t ${networkQuality === '4G' ? 'h-full ' + getSignalColor().replace('text', 'bg') : 'h-2'}`}></div>
          </div>
          <span className="text-[10px] text-gray-400 font-bold">{networkQuality} OPTIMIZED</span>
        </div>

        <button className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors text-gray-600">
          <Share2 size={24} />
        </button>
      </div>
    </div>
  );
};

export default LivePlayer;