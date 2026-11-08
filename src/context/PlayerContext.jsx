
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export function PlayerProvider({ children }) {
  const audioRef = useRef(null);

  if (!audioRef.current) {
    audioRef.current = new Audio();
  }

  const [queue, setQueue] = useState([]);
  const [index, setIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  const current = queue[index] ?? null;

  // Load and play whenever the current track changes.
  useEffect(() => {
    if (!current) return;

    const audio = audioRef.current;
    audio.src = current.previewUrl;
    audio.play().catch(() => {});
  }, [current]);

  // Wire up audio events.
  useEffect(() => {
    const audio = audioRef.current;

    const onTime = () =>
      setProgress(
        audio.duration ? audio.currentTime / audio.duration : 0
      );

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const onEnd = () => {
      if (index < queue.length - 1) {
        setIndex(index + 1);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    audio.addEventListener("ended", onEnd);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", onEnd);
    };
  }, [index, queue]);

  const toggle = () => {
    const audio = audioRef.current;

    if (audio.paused) {
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  };

  const playTrack = (track, tracks) => {
    if (current?.trackId === track.trackId) {
      return toggle();
    }

    const playable = tracks.filter((t) => t.previewUrl);

    setQueue(playable);
    setIndex(
      playable.findIndex((t) => t.trackId === track.trackId)
    );
  };

  const next = () =>
    index < queue.length - 1 && setIndex(index + 1);

  const prev = () =>
    index > 0 && setIndex(index - 1);

  const seek = (ratio) => {
    const audio = audioRef.current;

    if (audio.duration) {
      audio.currentTime = ratio * audio.duration;
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        current,
        isPlaying,
        progress,
        playTrack,
        toggle,
        next,
        prev,
        seek,
        hasNext: index < queue.length - 1,
        hasPrev: index > 0,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
}
