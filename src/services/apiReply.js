export async function sendReply({ to, subject, message }) {
  const response = await fetch("/api/send-reply", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to, subject, message }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Eroare la trimiterea emailului");
  }

  return data;
}
