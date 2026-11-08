
import { useCollection } from "../context/CollectionContext.jsx";

export default function Navbar({ page, setPage }) {
  const { albums } = useCollection();
  const count = Object.keys(albums).length;

  const tab = (id, label) => (
    <button
      className={`nav-tab ${page === id ? "active" : ""}`}
      onClick={() => setPage(id)}
    >
      {label}
    </button>
  );

  return (
    <header className="navbar">
      <h1 className="logo">Album Tracker</h1>

      <nav>
        {tab("discover", "Discover")}
        {tab("collection", `My collection (${count})`)}
        {tab("ai", "Recommendations")}
      </nav>
    </header>
  );
}
