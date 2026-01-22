import { useAccount, useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import {
  FACTORY_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";

export default function LPDashboard() {
  const { address } = useAccount();

  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const pair =
    pairAddress && pairAddress !== "0x0000000000000000000000000000000000000000"
      ? pairAddress
      : null;

  const { data: reserves } = useReadContract({
    address: pair,
    abi: pairAbi,
    functionName: "getReserves",
    query: {
      enabled: !!pair,
    },
  });

  const { data: userLpBalance } = useReadContract({
    address: pair,
    abi: pairAbi,
    functionName: "balanceOf",
    args: [address],
    query: {
      enabled: !!pair && !!address,
    },
  });

  const { data: totalLpSupply } = useReadContract({
    address: pair,
    abi: pairAbi,
    functionName: "totalSupply",
    query: {
      enabled: !!pair,
    },
  });

  if (!pair) return <p>No pool created yet.</p>;
  if (!reserves || !totalLpSupply) return <p>Loading LP data...</p>;

  const reserve0 = Number(reserves[0]);
  const reserve1 = Number(reserves[1]);

  const userLP = Number(userLpBalance ?? 0);
  const totalLP = Number(totalLpSupply);

  const poolShare = totalLP > 0 ? ((userLP / totalLP) * 100).toFixed(4) : "0";

  const priceToken0 = reserve1 / reserve0;
  const priceToken1 = reserve0 / reserve1;

  return (
    <div className="p-4 border rounded-lg mt-6">
      <h3>LP Dashboard</h3>

      <p>
        <strong>Pair Address:</strong> {pair}
      </p>

      <hr />

      <p>
        <strong>Your LP Tokens:</strong> {userLP}
      </p>
      <p>
        <strong>Total LP Supply:</strong> {totalLP}
      </p>
      <p>
        <strong>Your Pool Share:</strong> {poolShare}%
      </p>

      <hr />

      <p>
        <strong>Reserves:</strong>
      </p>
      <p>Token0: {reserve0}</p>
      <p>Token1: {reserve1}</p>

      <hr />

      <p>
        <strong>Prices:</strong>
      </p>
      <p>1 Token0 = {priceToken0.toFixed(6)} Token1</p>
      <p>1 Token1 = {priceToken1.toFixed(6)} Token0</p>
    </div>
  );
}
