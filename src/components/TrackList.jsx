
import { usePlayer } from "../context/PlayerContext.jsx";

const fmt = (ms) => {
  const s = Math.round(ms / 1000);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

export default function TrackList({ tracks }) {
  const { current, isPlaying, playTrack } = usePlayer();

  return (
    <ol className="tracks">
      {tracks.map((t) => {
        const active = current?.trackId === t.trackId;

        return (
          <li
            key={t.trackId}
            className={active ? "track active" : "track"}
          >
            <button
              className="play-btn"
              disabled={!t.previewUrl}
              onClick={() => playTrack(t, tracks)}
              aria-label={
                active && isPlaying
                  ? `Pause ${t.trackName}`
                  : `Play ${t.trackName}`
              }
            >
              {active && isPlaying ? "❚❚" : "▶"}
            </button>

            <span className="track-name">{t.trackName}</span>
            <span className="track-time">
              {fmt(t.trackTimeMillis)}
            </span>
          </li>
        );
      })}
    </ol>
  );
}
