import { useRef, useEffect,useState } from 'react';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { usePlayer } from '../../contexts/PlayerContext';
import { convertdurationToTimeString } from '../../utils/convertDurationToTimeString';
export default function Player(){
  const audioRef = useRef<HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const {episodeList, currentEpisodeIndex, isPlaying, tooglePlay, setPlayingState, PlayNext, PlayPrevious, hasNext, hasPrevious, isLooping, toogleLoop, toogleShuffle, isShuffling, clearPlayerState} = usePlayer();
  useEffect(() => {  // quero que essa função dispare toda vez que o isPlaying tiver o seu valor alterado
    if(!audioRef.current){
      return;
    }
    if(isPlaying){
      audioRef.current.play();
    } else{
      audioRef.current.pause();
    }
  }, [isPlaying])

  function setupProgressListener() {
    audioRef.current.currentTime = 0;
    audioRef.current.addEventListener('timeupdate', () =>{
      setProgress(Math.floor(audioRef.current.currentTime));
    });
  }

  function handleSeek(amount: number){
    audioRef.current.currentTime = amount;
    setProgress(amount);
  }

  function handleEpisodeEnded(){
    if(hasNext){
      PlayNext()
    } else{
      clearPlayerState()
    }
  }

  const episode = episodeList[currentEpisodeIndex];
  return(
    <div className={styles.playerContainer}>
      <header>
        <img src="/playing.svg" alt="Tocando agora"/>
        <strong>Tocando agora</strong>
      </header>
      { episode ? ( // if 
        <div className={styles.currentEpisode}>
          <Image
            width={692}
            height={430}
            src={episode.thumbnail}
            objectFit="cover"
          />
          <strong>{episode.title}</strong>
          <span>{episode.members}</span>
        </div>
      ) : (
        <div className={styles.emptyPlayer}>
        <strong>Selecione um podcast para ouvir</strong>
      </div>
      )}
      <footer className={!episode ? styles.empty : ''}>
        <div className={styles.progress}>
          <span>{convertdurationToTimeString(progress)}</span>
            <div className={styles.slider}>
              {episode ? (
                <Slider
                  max={episode.duration}
                  value={progress}
                  onChange={handleSeek}
                  trackStyle={{backgroundColor:'#04d361'}} // cor do slide bar já visto
                  railStyle={{backgroundColor:'#9f75ff'}} // cor da slide bar não vista
                  handleStyle={{borderColor:'#04d361', borderWidth: 4}} // cor da bolinha da slide bar
                />
              ) : (
                <div className={styles.emptySlider}/>
              )}
            </div>
            <span>{convertdurationToTimeString(episode?.duration ?? 0)}</span>
        </div>
        { episode &&(
          <audio
            src={episode.url}
            ref={audioRef}
            autoPlay
            onEnded={handleEpisodeEnded}
            loop= {isLooping}
            onPlay={() => setPlayingState(true)}  // quando o usario der um onPlay vamos disparar a função com setPlayingstate true        
            onPause={() => setPlayingState(false)}
            onLoadedMetadata={setupProgressListener}
          />  
        )}
        <div className={styles.buttons}>
          <button type="button" onClick={toogleShuffle} disabled={!episode ||episodeList.length ===1} className={isShuffling ? styles.isActive : ''}>
            <img src="/shuffle.svg" alt="Embaralhar"/>
          </button>
          <button type="button" onClick={PlayPrevious} disabled={!episode || !hasPrevious}>
            <img src="/play-previous.svg" alt="Tocar anterior"/>
          </button>
          <button type="button" className={styles.playButton} disabled={!episode} onClick={tooglePlay}>
            {isPlaying ? 
            <img src="/pause.svg" alt="Tocar"/>
            : <img src="/play.svg" alt="Tocar"/>}
          </button>
          <button type="button" onClick={PlayNext} disabled={!episode || !hasNext}>
            <img src="/play-next.svg" alt="Pular próxima"/>
          </button>
          <button type="button" onClick={toogleLoop} disabled={!episode} className={isLooping ? styles.isActive : ''}>
            <img src="/repeat.svg" alt="Repetir"/>
          </button>
        </div>
      </footer>
    </div>
  );
}