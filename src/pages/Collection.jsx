
import { useState } from "react";
import AlbumCard from "../components/AlbumCard.jsx";
import { STATUSES } from "../components/StatusSelect.jsx";
import { useCollection } from "../context/CollectionContext.jsx";

export default function Collection({ openAlbum }) {
  const { albums } = useCollection();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("name");

  const list = Object.values(albums)
    .filter((a) => filter === "all" || a.status === filter)
    .filter((a) =>
      `${a.name} ${a.artist}`
        .toLowerCase()
        .includes(query.toLowerCase())
    )
    .sort((a, b) =>
      sort === "rating"
        ? b.rating - a.rating
        : sort === "artist"
          ? a.artist.localeCompare(b.artist)
          : a.name.localeCompare(b.name)
    );

  if (Object.keys(albums).length === 0) {
    return (
      <section className="page">
        <h2 className="page-title">My collection</h2>
        <p className="notice">
          Nothing saved yet. Open an album in Discover and choose Save to collection.
        </p>
      </section>
    );
  }

  return (
    <section className="page">
      <h2 className="page-title">My collection</h2>

      <div className="filters">
        <div className="chips">
          {[{ id: "all", label: "All" }, ...STATUSES].map((s) => (
            <button
              key={s.id}
              className={`chip ${filter === s.id ? "on" : ""}`}
              onClick={() => setFilter(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>

        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter by title or artist"
          aria-label="Filter collection"
        />

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort by"
        >
          <option value="name">Sort: title</option>
          <option value="artist">Sort: artist</option>
          <option value="rating">Sort: rating</option>
        </select>
      </div>

      {list.length === 0 && (
        <p className="notice">
          No albums match those filters.
        </p>
      )}

      <div className="grid">
        {list.map((a) => (
          <AlbumCard
            key={a.collectionId}
            title={a.name}
            artist={a.artist}
            art={a.artwork}
            meta={`${STATUSES.find((s) => s.id === a.status)?.label}${
              a.rating ? " · " + "★".repeat(a.rating) : ""
            }`}
            onOpen={() => openAlbum(a.collectionId)}
          />
        ))}
      </div>
    </section>
  );
}
