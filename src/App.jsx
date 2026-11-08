
import { useState } from "react";
import Navbar from "./components/Navbar.jsx";
import Player from "./components/Player.jsx";
import Discover from "./pages/Discover.jsx";
import AlbumDetail from "./pages/AlbumDetail.jsx";
import Collection from "./pages/Collection.jsx";
import AiPicks from "./pages/AiPicks.jsx";

export default function App() {
  const [page, setPage] = useState("discover");
  const [albumId, setAlbumId] = useState(null);

  const openAlbum = (id) => {
    setAlbumId(id);
    setPage("album");
  };

  return (
    <>
      <Navbar page={page} setPage={setPage} />

      <main>
        <div hidden={page !== "discover"}>
          <Discover openAlbum={openAlbum} />
        </div>

        {page === "album" && (
          <AlbumDetail
            albumId={albumId}
            back={() => setPage("discover")}
          />
        )}

        {page === "collection" && (
          <Collection openAlbum={openAlbum} />
        )}

        {page === "ai" && (
          <AiPicks openAlbum={openAlbum} />
        )}
      </main>

      <Player />
    </>
  );
}
