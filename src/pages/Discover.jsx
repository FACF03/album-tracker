
import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { searchAlbums } from "../services/itunes.js";

export default function Discover({ openAlbum }) {
  const [term, setTerm] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async () => {
    if (!term.trim()) return;

    setLoading(true);
    setError("");

    try {
      setResults(await searchAlbums(term.trim()));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="page">
      <h2 className="page-title">Find an album</h2>

      <div className="search">
        <input
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          placeholder="Search by album or artist"
          aria-label="Search albums"
        />

        <button onClick={onSubmit} disabled={loading}>
          {loading ? "Searching…" : "Search"}
        </button>
      </div>

      {error && <p className="notice error">{error}</p>}

      {results === null && !error && (
        <p className="notice">
          Search for an album to see its tracks, play 30-second previews, and
          save it.
        </p>
      )}

      {results?.length === 0 && (
        <p className="notice">
          No albums found for “{term}”. Check the spelling or try the artist's
          name.
        </p>
      )}

      <div className="grid">
        {results?.map((a) => (
          <AlbumCard
            key={a.collectionId}
            title={a.collectionName}
            artist={a.artistName}
            art={a.artworkUrl100}
            meta={a.releaseDate?.slice(0, 4)}
            onOpen={() => openAlbum(a.collectionId)}
          />
        ))}
      </div>
    </section>
  );
}
