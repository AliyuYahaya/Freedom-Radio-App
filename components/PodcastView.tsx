import React, { useState } from 'react';
import { Download, PlayCircle, Check, Search, Wifi } from 'lucide-react';
import { Station, Program, PodcastEpisode } from '../types';
import { MOCK_PROGRAMS } from '../constants';

interface PodcastViewProps {
  station: Station;
}

const PodcastView: React.FC<PodcastViewProps> = ({ station }) => {
  const [selectedProgramId, setSelectedProgramId] = useState<string>(MOCK_PROGRAMS[0].id);
  const [downloadedEpisodes, setDownloadedEpisodes] = useState<Set<string>>(new Set());
  
  const activeProgram = MOCK_PROGRAMS.find(p => p.id === selectedProgramId) || MOCK_PROGRAMS[0];

  const handleDownload = (id: string) => {
    // Simulate download delay
    setTimeout(() => {
      setDownloadedEpisodes(prev => new Set(prev).add(id));
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full animate-in slide-in-from-right duration-300">
      {/* Filters / Header */}
      <div className="p-4 bg-white border-b border-gray-100 sticky top-0 z-10">
        <label className="block text-xs font-bold text-gray-400 uppercase mb-1">Select Program</label>
        <div className="relative">
          <select 
            value={selectedProgramId}
            onChange={(e) => setSelectedProgramId(e.target.value)}
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium appearance-none focus:outline-none focus:ring-2 focus:ring-offset-1"
            style={{ focusRingColor: station.primaryColor }}
          >
            {MOCK_PROGRAMS.map(prog => (
              <option key={prog.id} value={prog.id}>{prog.title}</option>
            ))}
          </select>
          <div className="absolute right-3 top-3.5 pointer-events-none text-gray-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </div>
        </div>
        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
          <Wifi size={12} />
          <span>WiFi download recommended</span>
        </div>
      </div>

      {/* Episode List */}
      <div className="flex-1 overflow-y-auto pb-20">
        <div className="p-4 space-y-3">
          {activeProgram.episodes.map((ep) => {
            const isDownloaded = downloadedEpisodes.has(ep.id);
            return (
              <div key={ep.id} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 flex items-center justify-between active:scale-[0.99] transition-transform">
                <div className="flex-1 pr-3">
                  <h4 className="font-semibold text-gray-800 line-clamp-1">{ep.title}</h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span>{ep.date}</span>
                    <span>•</span>
                    <span>{ep.duration}</span>
                    <span>•</span>
                    <span>{ep.size}</span>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                   {/* Play Action */}
                  <button className="text-gray-400 hover:text-gray-800 transition-colors">
                     <PlayCircle size={32} style={{ color: station.primaryColor }} />
                  </button>

                  {/* Download Action */}
                  <button 
                    onClick={() => handleDownload(ep.id)}
                    disabled={isDownloaded}
                    className={`p-2 rounded-full transition-colors ${isDownloaded ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                  >
                    {isDownloaded ? <Check size={18} /> : <Download size={18} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Storage Indicator */}
        <div className="mx-4 mt-2 mb-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex justify-between text-xs font-bold text-gray-500 mb-1">
                <span>STORAGE</span>
                <span>45MB / 100MB</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-500 h-2 rounded-full" style={{ width: '45%' }}></div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default PodcastView;