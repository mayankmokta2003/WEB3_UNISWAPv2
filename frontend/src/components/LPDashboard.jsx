import { useAccount, useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import erc20Abi from "../abi/ERC20.json"
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

  const { data: userBalance0 } = useReadContract({
    address: TOKEN0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address]
  });


  const { data: userBalance1 } = useReadContract({
    address: TOKEN1_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address]
  });



  if (!pair) return <p>No pool created yet.</p>;
  if (!reserves) return <p>Loading LP data...</p>;

  const reserve0 = Number(reserves[0]);
  const reserve1 = Number(reserves[1]);

  const priceToken0 = reserve1 / reserve0;
  const priceToken1 = reserve0 / reserve1;

  return (
    <div className="p-4 border rounded-lg mt-6 bg-amber-800">

      <div className="flex flex-col justify-center items-center space-y-2">
      <h3 className="text-4xl">LP Dashboard</h3>

<p>
  <strong>Pair Address:</strong> {pair}
</p>
      </div>

      <br/>
      <hr />
      <hr />
      <hr />
      <br/>

      <div className="flex flex-col justify-center items-center space-y-2">
      <p>
        <p className="text-xl">Prices:</p>
      </p>
      <p>1 Token0 = {priceToken0.toFixed(6)} Token1</p>
      <p>1 Token1 = {priceToken1.toFixed(6)} Token0</p>
      </div>
      <br/>
      <hr />
      <hr />
      <hr />
      <br/>

     <div className="flex flex-col justify-center items-center space-y-2">
     <p className="text-xl">User Balance</p>
      <p>User's Token0 Balance: {userBalance0}</p>
      <p>User's Token1 Balance: {userBalance1}</p>
     </div>
     

    </div>
  );
}
