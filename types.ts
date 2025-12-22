export enum ViewState {
  HOME = 'HOME',
  STATION_DETAIL = 'STATION_DETAIL',
  SETTINGS = 'SETTINGS'
}

export enum StationId {
  KANO = 'kano_995',
  DUTSE = 'dutse_995',
  KADUNA = 'kaduna_929',
  DALA = 'dala_885'
}

export interface Station {
  id: StationId;
  name: string;
  frequency: string;
  location: string;
  streamUrl: string;
  primaryColor: string;
  secondaryColor: string;
  gradientFrom: string;
  gradientTo: string;
  textColor: string;
}

export interface PodcastEpisode {
  id: string;
  title: string;
  date: string;
  duration: string;
  size: string;
}

export interface Program {
  id: string;
  title: string;
  host: string;
  episodes: PodcastEpisode[];
}

export type Tab = 'LIVE' | 'PODCAST' | 'VOICE';