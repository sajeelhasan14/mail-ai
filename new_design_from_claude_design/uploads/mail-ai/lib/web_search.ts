export async function searchWeb(query: string): Promise<string> {
  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.TAVILY_API_KEY}`, // ← key goes here now
    },
    body: JSON.stringify({
      query,
      max_results: 3,
      include_answer: true, // ask for a concise summary
    }),
  });

  const data = await res.json();
  return (
    data.answer || data.results?.map((r: any) => r.content).join("\n") || ""
  );
}
