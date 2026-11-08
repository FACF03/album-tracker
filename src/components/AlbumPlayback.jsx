
import { useEffect, useState } from "react";
import TrackList from "./TrackList.jsx";
import { findDeezerAlbumId } from "../services/deezer.js";
import { usePlayer } from "../context/PlayerContext.jsx";
import useLocalStorage from "../hooks/useLocalStorage.js";

export default function AlbumPlayback({ title, artist, tracks }) {
  const { isPlaying, toggle } = usePlayer();

  const [deezerId, setDeezerId] = useState(null);

  const [useDeezer, setUseDeezer] = useLocalStorage(
    "album-tracker:use deezer",
    false
  );

  useEffect(() => {
    let cancelled = false;

    setDeezerId(null);

    findDeezerAlbumId(title, artist)
      .then((id) => !cancelled && setDeezerId(id))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [title, artist]);

  const showPlayer = () => {
    if (isPlaying) toggle();

    setUseDeezer(true);
  };

  // The Deezer player replaces the default track list.
  if (deezerId && useDeezer) {
    return (
      <div>
        <iframe
          title="Deezer player"
          src={`https://widget.deezer.com/widget/dark/album/${deezerId}`}
          width="100%"
          height="300"
          style={{ border: 0, borderRadius: 12 }}
          allow="encrypted-media; clipboard-write"
          loading="lazy"
        />

        <p className="card-meta">
          Only previews playing? Log in to Deezer in this browser, then reload.{" "}
          <button
            className="link-btn"
            onClick={() => setUseDeezer(false)}
          >
            Back to 30-second previews
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      {deezerId && (
        <div className="deezer-callout">
          <p>
            Want to play this album in full on Deezer? You'll need to be
            logged in to Deezer.
          </p>

          <div className="callout-actions">
            <a
              className="btn-link"
              href="https://www.deezer.com/login"
              target="_blank"
              rel="noreferrer"
            >
              Log in to Deezer
            </a>

            <button className="primary" onClick={showPlayer}>
              I'm logged in, show player
            </button>
          </div>
        </div>
      )}

      <TrackList tracks={tracks} />
    </>
  );
}
