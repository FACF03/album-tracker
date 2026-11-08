
import { bigArt } from "../services/itunes.js";

export default function AlbumCard({ title, artist, art, meta, onOpen }) {
  return (
    <button className="album-card" onClick={onOpen}>
      <div className="sleeve">
        <span className="disc" aria-hidden="true" />
        <img
          src={bigArt(art, 300)}
          alt={`${title} cover`}
          loading="lazy"
        />
      </div>

      <strong className="card-title">{title}</strong>
      <span className="card-artist">{artist}</span>

      {meta && <span className="card-meta">{meta}</span>}
    </button>
  );
}
