import { ReactNode, createContext, useContext, useState } from "react";

type Episode = {
  title: string;
  members: string;
  thumbnail: string;
  duration: number;
  url: string;
};

type PlayerContextData = {
  episodeList: Episode[];
  currentEpisodeIndex: number;
  isPlaying: boolean;
  isLooping: boolean;
  isShuffling: boolean;
  play: (episode: Episode) => void;
  togglePlay: () => void;
  toggleLoop: () => void;
  toggleShuffling: () => void;
  setAudioIsPlaying: (state) => void;
  playList: (list: Episode[], index: number) => void;
  playNext: () => void;
  playPrevious: () => void;
  clearPlayerState: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
};

type PlayerContextProps = {
  children: ReactNode;
};

export const PlayerContext = createContext({} as PlayerContextData);

export function PlayerContextProvider({ children }: PlayerContextProps) {
  const [episodeList, setEpisodeList] = useState([]);
  const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  function play(episode) {
    setEpisodeList([episode]);
    setCurrentEpisodeIndex(0);
    setIsPlaying(true);
  }

  function playList(list: Episode[], index: number) {
    setEpisodeList(list);
    setCurrentEpisodeIndex(index);
    setIsPlaying(true);
  }

  function togglePlay() {
    setIsPlaying(!isPlaying);
  }

  function toggleShuffling() {
    setIsShuffling(!isShuffling);
  }

  function toggleLoop() {
    setIsLooping(!isLooping);
  }

  function setAudioIsPlaying(state) {
    setIsPlaying(state);
  }

  const hasNext = isShuffling || currentEpisodeIndex + 1 < episodeList.length;
  const hasPrevious = currentEpisodeIndex > 0;

  function playNext() {
    debugger;
    if (isShuffling) {
      const nextRandomEpisodeIndex = Math.floor(
        Math.random() * episodeList.length
      );

      setCurrentEpisodeIndex(nextRandomEpisodeIndex);
    } else if (hasNext) {
      setCurrentEpisodeIndex(currentEpisodeIndex + 1);
    }
  }

  function playPrevious() {
    if (hasPrevious) {
      setCurrentEpisodeIndex(currentEpisodeIndex - 1);
    }
  }

  function clearPlayerState() {
    setEpisodeList([]);
    setCurrentEpisodeIndex(0);
  }

  return (
    <PlayerContext.Provider
      value={{
        clearPlayerState,
        currentEpisodeIndex,
        episodeList,
        hasNext,
        hasPrevious,
        isLooping,
        isPlaying,
        isShuffling,
        play,
        playList,
        playNext,
        playPrevious,
        setAudioIsPlaying,
        toggleLoop,
        togglePlay,
        toggleShuffling,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => {
  return useContext(PlayerContext);
};
