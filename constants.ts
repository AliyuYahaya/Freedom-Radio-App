import { Station, StationId, Program } from './types';

export const STATIONS: Record<StationId, Station> = {
  [StationId.KANO]: {
    id: StationId.KANO,
    name: "Freedom Radio",
    frequency: "99.5 FM",
    location: "KANO",
    streamUrl: "https://stream.zeno.fm/t8bhnmek8mzuv",
    primaryColor: "#0066FF",
    secondaryColor: "#FF6B35",
    gradientFrom: "from-[#0066FF]",
    gradientTo: "to-[#FF6B35]",
    textColor: "text-white"
  },
  [StationId.DUTSE]: {
    id: StationId.DUTSE,
    name: "Freedom Radio",
    frequency: "99.5 FM",
    location: "DUTSE",
    streamUrl: "https://stream.zeno.fm/wp75as7e9mzuv",
    primaryColor: "#00D9A3",
    secondaryColor: "#FFC914",
    gradientFrom: "from-[#00D9A3]",
    gradientTo: "to-[#FFC914]",
    textColor: "text-gray-900"
  },
  [StationId.KADUNA]: {
    id: StationId.KADUNA,
    name: "Freedom Radio",
    frequency: "92.9 FM",
    location: "KADUNA",
    streamUrl: "https://stream.zeno.fm/5z9v4k7e9mzuv",
    primaryColor: "#7B2CBF",
    secondaryColor: "#FF006E",
    gradientFrom: "from-[#7B2CBF]",
    gradientTo: "to-[#FF006E]",
    textColor: "text-white"
  },
  [StationId.DALA]: {
    id: StationId.DALA,
    name: "Dala FM",
    frequency: "88.5 FM",
    location: "KANO",
    streamUrl: "https://stream.zeno.fm/9zdvuszaanzuv",
    primaryColor: "#FF6F00",
    secondaryColor: "#DC2626",
    gradientFrom: "from-[#FF6F00]",
    gradientTo: "to-[#DC2626]",
    textColor: "text-white"
  }
};

export const MOCK_PROGRAMS: Program[] = [
  {
    id: "gaskiya",
    title: "Gaskiya Ta Ke Kunshe",
    host: "Malam Yusuf Ibrahim",
    episodes: [
      { id: "1", title: "2024 Budget Analysis", date: "Nov 15", duration: "45:00", size: "12MB" },
      { id: "2", title: "Education Crisis", date: "Nov 14", duration: "42:30", size: "11MB" },
      { id: "3", title: "Market Prices Update", date: "Nov 13", duration: "38:15", size: "10MB" }
    ]
  },
  {
    id: "indabanki",
    title: "Inda Banki",
    host: "Hajiya Fatima",
    episodes: [
      { id: "4", title: "Community Health", date: "Nov 15", duration: "25:00", size: "6MB" },
      { id: "5", title: "Youth Employment", date: "Nov 12", duration: "28:45", size: "7MB" }
    ]
  }
];