
import { useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import erc20Abi from "../abi/ERC20.json";
import { PAIR_ADDRESS, TOKEN0_ADDRESS, TOKEN1_ADDRESS } from "../config/addresses";

export default function Reserves() {
  const { data: reserves, isLoading } = useReadContract({
    address: PAIR_ADDRESS,
    abi: pairAbi,
    functionName: "getReserves",
  });

  const { data: pairToken0Balance } = useReadContract({
    address: TOKEN0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [PAIR_ADDRESS],

  });

  const { data: pairToken1Balance } = useReadContract({
    address: TOKEN1_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [PAIR_ADDRESS],
  })

  console.log("PAIR token0 balance:", pairToken0Balance?.toString());
  console.log("blablablabla", reserves?.toString());

  if (isLoading || !reserves) return <p>Loading reserves...</p>;

  return (
    <div>
      <p>Token0: {pairToken1Balance?.toString()}</p>
      <p>Token1: {pairToken0Balance?.toString()}</p>
      {/* <p>Token0: {reserves[0].toString()}</p>
      <p>Token1: {reserves[1].toString()}</p> */}
    </div>
  );
}



