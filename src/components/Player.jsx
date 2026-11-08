
import { usePlayer } from "../context/PlayerContext.jsx";
import { bigArt } from "../services/itunes.js";

export default function Player() {
  const {
    current,
    isPlaying,
    progress,
    toggle,
    next,
    prev,
    seek,
    hasNext,
    hasPrev,
  } = usePlayer();

  if (!current) return null;

  return (
    <footer className="player">
      <img src={bigArt(current.artworkUrl100, 120)} alt="" />

      <div className="now">
        <strong>{current.trackName}</strong>
        <span>{current.artistName}</span>
      </div>

      <div className="controls">
        <button onClick={prev} disabled={!hasPrev} aria-label="Previous track">
          ⏮
        </button>

        <button
          className="main"
          onClick={toggle}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>

        <button onClick={next} disabled={!hasNext} aria-label="Next track">
          ⏭
        </button>
      </div>

      <input
        className="seek"
        type="range"
        min="0"
        max="1000"
        value={Math.round(progress * 1000)}
        onChange={(e) => seek(e.target.value / 1000)}
        aria-label="Seek"
      />
    </footer>
  );
}
