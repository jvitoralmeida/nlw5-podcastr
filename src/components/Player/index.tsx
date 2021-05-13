import "rc-slider/assets/index.css";

import { PlayerContext, usePlayer } from "../../contexts/PlayerContext";
import { useContext, useEffect, useRef, useState } from "react";

import Image from "next/image";
import Slider from "rc-slider";
import { convertDurationToTimeString } from "../../Util/convertDurationToTimeString";
import styles from "./styles.module.scss";

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);

  function setUpProgressListener() {
    audioRef.current.currentTime = 0;

    audioRef.current.addEventListener("timeupdate", (event) => {
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number) {
    audioRef.current.currentTime = amount;

    setProgress(amount);
  }

  function handleEpisodeEnded() {
    setProgress(0);
    if (hasNext) {
      playNext();
    } else {
      clearPlayerState();
    }
  }

  const {
    currentEpisodeIndex,
    episodeList,
    hasNext,
    hasPrevious,
    isLooping,
    isPlaying,
    isShuffling,
    playNext,
    playPrevious,
    setAudioIsPlaying,
    toggleLoop,
    togglePlay,
    toggleShuffling,
    clearPlayerState,
  } = usePlayer();

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    if (isPlaying) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  const episode = episodeList[currentEpisodeIndex];

  return (
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora" />
        <strong>Tocando agora {episode?.title}</strong>
      </header>

      {episode ? (
        <div className={styles.currentEpisode}>
          <Image
            width={592}
            height={592}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
          <span>Seleciona um podcast para ouvir</span>
        </div>
      )}

      <footer className={!episode ? styles.empty : ""}>
        <div className={styles.progress}>
          <span>{convertDurationToTimeString(progress)}</span>
          <div className={styles.slider}>
            {episode ? (
              <Slider
                max={episode.duration}
                value={progress}
                trackStyle={{ backgroundColor: "#04d361" }}
                railStyle={{ backgroundColor: "#9f75ff" }}
                handleStyle={{ borderColor: "#04d361", borderWidth: "4px" }}
                onChange={handleSeek}
              />
            ) : (
              <div className={styles.emptySlider} />
            )}
          </div>
          <span>{convertDurationToTimeString(episode?.duration ?? 0)}</span>
        </div>

        {episode && (
          <audio
            src={episode.url}
            ref={audioRef}
            loop={isLooping}
            onPlay={() => setAudioIsPlaying(true)}
            onPause={() => setAudioIsPlaying(false)}
            onEnded={() => handleEpisodeEnded()}
            autoPlay
            onLoadedMetadata={() => setUpProgressListener()}
          />
        )}

        <div className={styles.button}>
          <button
            disabled={!episode || episodeList.length == 1}
            className={isShuffling ? styles.Active : ""}
            onClick={() => toggleShuffling()}
          >
            <img src="/shuffle.svg" alt="Modo aleatório" />
          </button>
          <button
            disabled={!episode || !hasPrevious}
            onClick={() => playPrevious()}
          >
            <img src="/play-previous.svg" alt="Anterior" />
          </button>
          <button className={styles.playButton} disabled={!episode}>
            {isPlaying ? (
              <img src="/pause.svg" alt="Pausar" onClick={() => togglePlay()} />
            ) : (
              <img src="/play.svg" alt="Tocar" onClick={() => togglePlay()} />
            )}
          </button>

          <button disabled={!episode || !hasNext} onClick={() => playNext()}>
            <img src="/play-next.svg" alt="Próximo" />
          </button>
          <button
            disabled={!episode}
            onClick={() => toggleLoop()}
            className={isLooping ? styles.Active : ""}
          >
            <img src="/repeat.svg" alt="Repetir" />
          </button>
        </div>
      </footer>
    </div>
  );
}
