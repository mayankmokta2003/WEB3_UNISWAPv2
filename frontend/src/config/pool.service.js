import { API_BASE_URL } from "./addresses";
import { RAILWAY_URL } from "./addresses";

export async function fetchPools() {
  // const res = await fetch(`${API_BASE_URL}/pools`);
  const res = await fetch(`${RAILWAY_URL}api/pools`);
  if (!res.ok) {
    throw new Error("Failed to fetch pools");
  }
  return res.json();
}
// mongodb://mongo:WSUcUVXuUmNjIgXcjUKQuwcWQLvINEvn@mongodb.railway.internal:27017
// https://web3uniswapv2-production.up.railway.app/