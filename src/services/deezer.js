
const norm = (s = "") =>
  s
    .toLowerCase()
    .replace(/\(.*?\)|\[.*?\]/g, "")
    .replace(/[^a-z0-9]/g, "");

export async function findDeezerAlbumId(title, artist) {
  const res = await fetch(
    `/api/deezer?q=${encodeURIComponent(`${title} ${artist}`)}`
  );

  if (!res.ok) return null;

  const { albums = [] } = await res.json();

  const t = norm(title);
  const a = norm(artist);

  // Only accept a confident match.
  const match = albums.find((x) => {
    const xt = norm(x.title);
    const xa = norm(x.artist);

    const sameArtist = xa && a && (xa.includes(a) || a.includes(xa));
    const sameTitle = xt && t && (xt.includes(t) || t.includes(xt));

    return sameArtist && sameTitle;
  });

  return match?.id ?? null;
}
