
export const STATUSES = [
  { id: "wishlist", label: "Want to listen" },
  { id: "listening", label: "Listening" },
  { id: "listened", label: "Listened" },
];

export default function StatusSelect({ value, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Listening status">
      {STATUSES.map((s) => (
        <button
          key={s.id}
          className={`chip ${value === s.id ? "on" : ""}`}
          onClick={() => onChange(s.id)}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
