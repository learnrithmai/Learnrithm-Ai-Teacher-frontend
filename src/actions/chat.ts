"use server";

export default async function createChatResponse(userQuery: string) {
  const response = await fetch("http://localhost:5000/api/v1/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userQuery }),
  });
  const data = await response.json();
  return data;
}
