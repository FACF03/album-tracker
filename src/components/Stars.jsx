
export default function Stars({ value, onChange }) {
  return (
    <div className="stars" role="group" aria-label="Rating">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          className={n <= value ? "star on" : "star"}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          onClick={() => onChange(n === value ? 0 : n)}
        >
          ★
        </button>
      ))}
    </div>
  );
}
