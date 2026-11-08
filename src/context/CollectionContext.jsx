
import { createContext, useContext } from "react";
import useLocalStorage from "../hooks/useLocalStorage.js";

const CollectionContext = createContext();

export const useCollection = () => useContext(CollectionContext);

export function CollectionProvider({ children }) {
  const [albums, setAlbums] = useLocalStorage(
    "album-tracker:collection",
    {}
  );

  const save = (album, status = "wishlist") =>
    setAlbums((prev) => ({
      ...prev,
      [album.collectionId]: {
        collectionId: album.collectionId,
        name: album.collectionName,
        artist: album.artistName,
        artwork: album.artworkUrl100,
        year: album.releaseDate?.slice(0, 4),
        status,
        rating: 0,
        notes: "",
      },
    }));

  const update = (id, patch) =>
    setAlbums((prev) => ({
      ...prev,
      [id]: { ...prev[id], ...patch },
    }));

  const remove = (id) =>
    setAlbums((prev) => {
      const { [id]: _removed, ...rest } = prev;
      return rest;
    });

  return (
    <CollectionContext.Provider
      value={{ albums, save, update, remove }}
    >
      {children}
    </CollectionContext.Provider>
  );
}
