import React, { useState, useEffect, useRef } from 'react';
import { Settings, ArrowLeft, Radio, Mic, Headphones, Signal, Home } from 'lucide-react';
import { ViewState, Station, Tab, StationId } from './types';
import { STATIONS } from './constants';
import StationCard from './components/StationCard';
import LivePlayer from './components/LivePlayer';
import PodcastView from './components/PodcastView';
import VoiceMessage from './components/VoiceMessage';

const App: React.FC = () => {
    const [view, setView] = useState<ViewState>(ViewState.HOME);
    const [activeStation, setActiveStation] = useState<Station | null>(null);
    const [currentTab, setCurrentTab] = useState<Tab>('LIVE');
    const [isPlaying, setIsPlaying] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);

    // Audio Element Ref
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [networkQuality, setNetworkQuality] = useState<'2G' | '3G' | '4G'>('3G');

    // Network Simulation Logic
    useEffect(() => {
        // Simulate detecting network conditions
        const checkConnection = () => {
            // In a real app, use navigator.connection
            // For this demo, we assume 3G in rural context initially, then upgrade
            setTimeout(() => setNetworkQuality('3G'), 3000);
        };
        checkConnection();
    }, []);

    // Audio Event Listeners
    useEffect(() => {
        if (!audioRef.current) {
            audioRef.current = new Audio();
            audioRef.current.preload = "none";
        }

        const audio = audioRef.current;

        const onPlay = () => setIsPlaying(true);
        const onPause = () => setIsPlaying(false);
        const onWaiting = () => setIsBuffering(true);
        const onPlaying = () => setIsBuffering(false);
        const onError = () => {
            setIsPlaying(false);
            setIsBuffering(false);
            alert("Connection lost. Retrying...");
        };

        audio.addEventListener('play', onPlay);
        audio.addEventListener('pause', onPause);
        audio.addEventListener('waiting', onWaiting);
        audio.addEventListener('playing', onPlaying);
        audio.addEventListener('error', onError);

        return () => {
            audio.removeEventListener('play', onPlay);
            audio.removeEventListener('pause', onPause);
            audio.removeEventListener('waiting', onWaiting);
            audio.removeEventListener('playing', onPlaying);
            audio.removeEventListener('error', onError);
        };
    }, []);

    const handleStationSelect = (station: Station) => {
        // If selecting a different station, stop current playback
        if (activeStation?.id !== station.id) {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.src = station.streamUrl;
                setIsPlaying(false);
            }
        }
        setActiveStation(station);
        setView(ViewState.STATION_DETAIL);
        setCurrentTab('LIVE');
    };

    const handleBack = () => {
        setView(ViewState.HOME);
    };

    const togglePlay = () => {
        if (!audioRef.current || !activeStation) return;

        if (isPlaying) {
            audioRef.current.pause();
        } else {
            // Ensure source is set
            if (audioRef.current.src !== activeStation.streamUrl) {
                audioRef.current.src = activeStation.streamUrl;
            }
            audioRef.current.play().catch(e => console.error("Playback failed", e));
        }
    };

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    const handleQuickNav = (tab: Tab) => {
        // Default to Kano station for quick actions if no station selected
        const targetStation = activeStation || STATIONS['kano_995'];
        setActiveStation(targetStation);
        setView(ViewState.STATION_DETAIL);
        setCurrentTab(tab);
        setIsSettingsOpen(false);
    };

    // Mini Player (Visible on Home if playing or station selected)
    const showMiniPlayer = view === ViewState.HOME && activeStation !== null;

    return (
        <div className="flex flex-col h-screen max-w-md mx-auto bg-white shadow-2xl relative overflow-hidden">

            {/* Header */}
            <header className="bg-white border-b border-gray-100 p-4 sticky top-0 z-30 flex items-center justify-between h-16 relative">
                {view === ViewState.HOME ? (
                    <div className="flex items-center gap-3">
                        <h1 className="text-xl font-black text-gray-900 tracking-tight leading-none">Tashoshin Freedom Radio Group</h1>
                        <div className="h-6 w-px bg-gray-300"></div>
                        <div className="flex items-center gap-1.5">
                            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">Powered by</span>
                            <span className="text-lg font-black text-[#FFCC00] bg-black px-2 py-0.5 rounded shadow-sm tracking-tight">MTN</span>
                        </div>
                    </div>
                ) : (
                    <button onClick={handleBack} className="p-2 -ml-2 text-gray-700 active:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                )}

                <div className="relative">
                    <button
                        onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                        className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${isSettingsOpen ? 'bg-gray-100 text-gray-900' : 'text-gray-400'}`}
                    >
                        <Settings size={24} />
                    </button>

                    {/* Settings Dropdown */}
                    {isSettingsOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2">
                            <div className="px-4 py-2 border-b border-gray-50 mb-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Quick Navigation</p>
                            </div>
                            <button
                                onClick={() => {
                                    setView(ViewState.HOME);
                                    setIsSettingsOpen(false);
                                }}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                                <Home size={18} className="text-gray-500" />
                                Home
                            </button>
                            <button
                                onClick={() => handleQuickNav('PODCAST')}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                                <Headphones size={18} className="text-blue-500 shrink-0" />
                                Manyan shirye-shiryen mu
                            </button>
                            <button
                                onClick={() => handleQuickNav('VOICE')}
                                className="w-full px-4 py-3 text-left text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                            >
                                <Mic size={18} className="text-green-500 shrink-0" />
                                A bar mana sakon murya
                            </button>
                            <div className="h-px bg-gray-100 my-1"></div>
                            <button className="w-full px-4 py-3 text-left text-sm text-gray-500 hover:bg-gray-50">
                                App Settings
                            </button>
                            <button className="w-full px-4 py-3 text-left text-sm text-gray-500 hover:bg-gray-50">
                                About & Help
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto bg-gray-50 relative custom-scrollbar">

                {view === ViewState.HOME && (
                    <div className="p-4 flex flex-col gap-4 pb-24">
                        <div className="grid grid-cols-2 gap-4">
                            {Object.values(STATIONS).map(station => (
                                <StationCard
                                    key={station.id}
                                    station={station}
                                    onClick={handleStationSelect}
                                />
                            ))}
                        </div>

                        {/* Quick Actions Dashboard */}
                        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                            <h3 className="text-sm font-bold text-gray-900 mb-3 uppercase tracking-wide">Quick Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    onClick={() => handleQuickNav('PODCAST')}
                                    className="flex flex-col items-center justify-center p-4 h-auto min-h-[100px] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors border border-blue-100 group"
                                >
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white transition-colors shrink-0">
                                        <Headphones size={20} className="text-blue-600" />
                                    </div>
                                    <span className="text-xs font-bold text-blue-900 text-center leading-tight whitespace-normal">Manyan shirye-shiryen mu</span>
                                </button>
                                <button
                                    onClick={() => handleQuickNav('VOICE')}
                                    className="flex flex-col items-center justify-center p-4 h-auto min-h-[100px] bg-green-50 rounded-xl hover:bg-green-100 transition-colors border border-green-100 group"
                                >
                                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-2 group-hover:bg-white transition-colors shrink-0">
                                        <Mic size={20} className="text-green-600" />
                                    </div>
                                    <span className="text-xs font-bold text-green-900 text-center leading-tight whitespace-normal">A bar mana sakon murya</span>
                                </button>
                            </div>
                        </div>

                        {/* Promo Banner / Info */}
                        <div className="bg-gray-800 rounded-xl p-4 text-white">
                            <div className="flex items-center gap-3">
                                <Signal className="text-green-400" />
                                <div>
                                    <p className="font-bold text-sm">Optimized for 3G Networks</p>
                                    <p className="text-xs text-gray-400">Low data usage mode active</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {view === ViewState.STATION_DETAIL && activeStation && (
                    <div className="h-full flex flex-col">
                        {/* Tab Content */}
                        <div className="flex-1 overflow-y-auto relative bg-white">
                            {currentTab === 'LIVE' && (
                                <LivePlayer
                                    station={activeStation}
                                    isPlaying={isPlaying}
                                    isBuffering={isBuffering}
                                    togglePlay={togglePlay}
                                    networkQuality={networkQuality}
                                />
                            )}
                            {currentTab === 'PODCAST' && (
                                <PodcastView station={activeStation} />
                            )}
                            {currentTab === 'VOICE' && (
                                <VoiceMessage station={activeStation} />
                            )}
                        </div>

                        {/* Tab Navigation Bar */}
                        <div className="bg-white border-t border-gray-200 px-4 py-2 flex justify-between items-center shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] z-20">
                            <NavTab
                                icon={<Radio size={20} />}
                                label="Live"
                                isActive={currentTab === 'LIVE'}
                                onClick={() => setCurrentTab('LIVE')}
                                color={activeStation.primaryColor}
                            />
                            <NavTab
                                icon={<Headphones size={20} />}
                                label="Shirye-shirye"
                                isActive={currentTab === 'PODCAST'}
                                onClick={() => setCurrentTab('PODCAST')}
                                color={activeStation.primaryColor}
                            />
                            <NavTab
                                icon={<Mic size={20} />}
                                label="Sakon Murya"
                                isActive={currentTab === 'VOICE'}
                                onClick={() => setCurrentTab('VOICE')}
                                color={activeStation.primaryColor}
                            />
                        </div>
                    </div>
                )}

            </main>

            {/* Global Mini Player (Overlay on Home) */}
            {showMiniPlayer && activeStation && (
                <div
                    onClick={() => {
                        setView(ViewState.STATION_DETAIL);
                        setCurrentTab('LIVE');
                    }}
                    className="absolute bottom-4 left-4 right-4 bg-gray-900 rounded-xl p-3 shadow-2xl flex items-center justify-between z-50 text-white cursor-pointer border border-gray-700"
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs border-2`} style={{ borderColor: activeStation.primaryColor, backgroundColor: activeStation.secondaryColor }}>
                            {activeStation.frequency.split(' ')[0]}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                            <span className="font-bold text-sm truncate">{activeStation.name}</span>
                            <span className="text-xs text-gray-400 truncate">{isPlaying ? "Playing..." : "Paused"}</span>
                        </div>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            togglePlay();
                        }}
                        className="p-2 bg-white rounded-full text-black hover:bg-gray-200"
                    >
                        {isBuffering ? (
                            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin"></div>
                        ) : isPlaying ? (
                            <div className="w-5 h-5 flex items-center justify-center">
                                <div className="w-1.5 h-3 bg-black mr-0.5"></div>
                                <div className="w-1.5 h-3 bg-black ml-0.5"></div>
                            </div>
                        ) : (
                            <Play size={20} fill="black" />
                        )}
                    </button>
                </div>
            )}

        </div>
    );
};

// Helper Subcomponent for Navigation Tabs
const NavTab: React.FC<{ icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void, color: string }> = ({ icon, label, isActive, onClick, color }) => (
    <button
        onClick={onClick}
        className={`flex flex-col items-center gap-1 py-2 px-4 rounded-lg transition-all duration-200 ${isActive ? 'font-bold' : 'text-gray-400 font-medium'}`}
        style={{ color: isActive ? color : undefined }}
    >
        {icon}
        <span className="text-[10px] uppercase tracking-wide">{label}</span>
    </button>
);

const Play = ({ size, fill }: { size: number, fill?: string }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="5 3 19 12 5 21 5 3" fill={fill}></polygon>
    </svg>
);

export default App;