
import { useEffect, useState } from "react";
import AlbumPlayback from "../components/AlbumPlayback.jsx";
import StatusSelect from "../components/StatusSelect.jsx";
import Stars from "../components/Stars.jsx";
import { useCollection } from "../context/CollectionContext.jsx";
import {
  bigArt,
  getAlbumTracks,
  spotifySearchUrl,
  youtubeSearchUrl,
} from "../services/itunes.js";

export default function AlbumDetail({ albumId, back }) {
  const { albums, save, update, remove } = useCollection();
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    setData(null);
    setError("");

    getAlbumTracks(albumId)
      .then(setData)
      .catch((e) => setError(e.message));
  }, [albumId]);

  if (error) {
    return (
      <section className="page">
        <p className="notice error">{error}</p>
      </section>
    );
  }

  if (!data) {
    return (
      <section className="page">
        <p className="notice">Loading album…</p>
      </section>
    );
  }

  const { album, tracks } = data;
  const saved = albums[album.collectionId];

  return (
    <section className="page">
      <button className="link-btn" onClick={back}>
        ← Back to search
      </button>

      <div className="detail-head">
        <img
          src={bigArt(album.artworkUrl100, 500)}
          alt={`${album.collectionName} cover`}
        />

        <div>
          <h2 className="page-title">
            {album.collectionName}
          </h2>

          <p className="detail-artist">
            {album.artistName}
          </p>

          <p className="card-meta">
            {album.releaseDate?.slice(0, 4)} ·{" "}
            {album.primaryGenreName} · {album.trackCount} tracks
          </p>

          <div className="where">
            <span>Listen on</span>

            <a
              href={spotifySearchUrl(
                album.collectionName,
                album.artistName
              )}
              target="_blank"
              rel="noreferrer"
            >
              Spotify
            </a>

            <a
              href={youtubeSearchUrl(
                album.collectionName,
                album.artistName
              )}
              target="_blank"
              rel="noreferrer"
            >
              YouTube
            </a>

            {album.collectionViewUrl && (
              <a
                href={album.collectionViewUrl}
                target="_blank"
                rel="noreferrer"
              >
                Apple Music
              </a>
            )}
          </div>

          {saved ? (
            <div className="tracker">
              <StatusSelect
                value={saved.status}
                onChange={(status) =>
                  update(album.collectionId, { status })
                }
              />

              <Stars
                value={saved.rating}
                onChange={(rating) =>
                  update(album.collectionId, { rating })
                }
              />

              <textarea
                value={saved.notes}
                onChange={(e) =>
                  update(album.collectionId, {
                    notes: e.target.value,
                  })
                }
                placeholder="Notes about this album"
                rows={3}
              />

              <button
                className="link-btn danger"
                onClick={() => remove(album.collectionId)}
              >
                Remove from collection
              </button>
            </div>
          ) : (
            <button
              className="primary"
              onClick={() => save(album)}
            >
              Save to collection
            </button>
          )}
        </div>
      </div>

      <AlbumPlayback
  title={album.collectionName}
  artist={album.artistName}
  tracks={tracks}
/>
    </section>
  );
}
