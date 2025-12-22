import React from 'react';
import { Play, Radio } from 'lucide-react';
import { Station } from '../types';

interface StationCardProps {
  station: Station;
  onClick: (station: Station) => void;
}

const StationCard: React.FC<StationCardProps> = ({ station, onClick }) => {
  // Determine if text should be white or black based on background, 
  // though the Station type has a property for this, let's enforce branding.
  const isLight = station.id === 'dutse_995'; 

  return (
    <div 
      onClick={() => onClick(station)}
      className={`relative overflow-hidden rounded-2xl p-4 h-48 flex flex-col justify-between shadow-lg transition-transform active:scale-95 cursor-pointer bg-gradient-to-br ${station.gradientFrom} ${station.gradientTo}`}
    >
      <div className="absolute top-0 right-0 p-3 opacity-20">
        <Radio size={64} className={isLight ? 'text-black' : 'text-white'} />
      </div>

      <div className={`${isLight ? 'text-gray-900' : 'text-white'} z-10`}>
        <h3 className="font-black text-2xl leading-tight">{station.name}</h3>
        <p className={`font-medium tracking-widest text-sm opacity-90`}>{station.frequency}</p>
        <p className="text-xs font-bold mt-1 uppercase opacity-75">{station.location}</p>
      </div>

      <div className={`flex items-center gap-2 mt-4 ${isLight ? 'text-gray-900' : 'text-white'} z-10`}>
        <div className={`p-2 rounded-full ${isLight ? 'bg-black/10' : 'bg-white/20'} backdrop-blur-sm`}>
            <Play size={20} fill="currentColor" />
        </div>
        <span className="text-xs font-bold">LISTEN NOW</span>
      </div>
    </div>
  );
};

export default StationCard;