import { API_BASE_URL } from "./addresses";

export async function fetchPools() {
  const res = await fetch(`${API_BASE_URL}/pools`);
  if (!res.ok) {
    throw new Error("Failed to fetch pools");
  }
  return res.json();
}
