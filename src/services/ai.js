
export async function getRecommendations(taste) {
  const res = await fetch("/api/recommend", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ taste }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Could not get recommendations.");
  }

  return data;
}
