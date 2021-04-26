import {createContext, useState, ReactNode, useContext} from 'react';
type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
}
type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  tooglePlay:() => void;
  toogleLoop:() => void;
  toogleShuffle:() => void;
  setPlayingState:(state: boolean) => void;
  playList:(list: Episode[], index: number) => void;
  PlayNext:() => void;
  PlayPrevious:() => void;
  hasNext: boolean;
  hasPrevious: boolean;
  clearPlayerState: () => void;
}
export const PlayerContext = createContext({} as PlayerContextData);

type PlayerContextProviderProps = {
  children: ReactNode;
}

export function PlayerContextProvider({children}: PlayerContextProviderProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  function play(episode: Episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }
  function playList(list: Episode[], index: number){
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);

  }
  function tooglePlay(){
    setIsPlaying(!isPlaying); // ! transforma para o contrario dela, se estiver positriva vira falsa e falsa vira positiva
  }

  function toogleLoop(){
    setIsLooping(!isLooping); // ! transforma para o contrario dela, se estiver positriva vira falsa e falsa vira positiva
  }
  function toogleShuffle(){
    setIsShuffling(!isShuffling); // ! transforma para o contrario dela, se estiver positriva vira falsa e falsa vira positiva
  }
  function setPlayingState(state: boolean) {
    setIsPlaying(state);
  }
  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }
  const hasPrevious = currentEpisodeIndex > 0;
  const hasNext = isShuffling || currentEpisodeIndex +1 < episodeList.length;

  function PlayNext() {
    if(isShuffling){
      const nextRandomEpisodeIndex = Math.floor(Math.random() * episodeList.length);
      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if(hasNext){
      return setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }  
    
  }
  function PlayPrevious() {
    if(hasPrevious){
      return setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }  
  }
  return (
    <PlayerContext.Provider value={{episodeList, currentEpisodeIndex, play, isPlaying,tooglePlay, setPlayingState, playList, PlayNext, PlayPrevious, hasNext, hasPrevious, toogleLoop, isLooping, toogleShuffle, isShuffling, clearPlayerState}}>
      {children}
    </PlayerContext.Provider>
  )}

  export const usePlayer = () => {
    return useContext(PlayerContext);
  }