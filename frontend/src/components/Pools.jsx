import { fetchPools } from "../config/pool.service";
import { useState, useEffect } from "react";

export default function Pools() {
  const [pools, setPools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPools() {
      try {
        const data = await fetchPools();
        setPools(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadPools();
  }, []);

  if (loading) return <p>Loading pools...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Liquidity Pools</h2>

      {pools.length === 0 && <p>No pools found</p>}

      {pools.map((pool) => (
        <div
          key={pool.pairAddress}
          style={{
            border: "1px solid #ccc",
            padding: "12px",
            marginBottom: "12px",
          }}
        >
          <p>
            <b>Pair:</b> {pool.token0} / {pool.token1}
          </p>
          <p>
            <b>Pair Address:</b> {pool.pairAddress}
          </p>

          <p>
            <b>Reserve0:</b> {pool.reserve0}
          </p>
          <p>
            <b>Reserve1:</b> {pool.reserve1}
          </p>

          <p>
            <b>Volume Token0:</b> {pool.volumeToken0}
          </p>
          <p>
            <b>Volume Token1:</b> {pool.volumeToken1}
          </p>
        </div>
      ))}
    </div>
  );
}
