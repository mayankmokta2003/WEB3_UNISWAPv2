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

  if (!pair) return <p>No pool created yet.</p>;
  if (!reserves) return <p>Loading LP data...</p>;

  const reserve0 = Number(reserves[0]);
  const reserve1 = Number(reserves[1]);

  const priceToken0 = reserve1 / reserve0;
  const priceToken1 = reserve0 / reserve1;

  return (
    <div className="p-4 border rounded-lg mt-6 ">
      <h3>LP Dashboard</h3>

      <p>
        <strong>Pair Address:</strong> {pair}
      </p>

      <hr />
      <hr />
      <hr />

      <p>
        <strong>Prices:</strong>
      </p>
      <p>1 Token0 = {priceToken0.toFixed(6)} Token1</p>
      <p>1 Token1 = {priceToken1.toFixed(6)} Token0</p>
    </div>
  );
}
