export async function generateExam(topic, count) {
  const payload = { topic, count: Number(count) };

  const res = await fetch("/generate-exam", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  // Try to parse JSON even when res.ok is false (to surface backend error msg)
  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.error || `Request failed with status ${res.status}`);
  }
  return data; // expected: { questions: string | array }
}
