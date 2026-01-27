import { useState } from "react";
import { useWriteContract, useReadContract } from "wagmi";
import {
  ROUTER_ADDRESS,
  FACTORY_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";
import pairAbi from "../abi/UniswapV2Pair.json";
import routerAbi from "../abi/UniswapV2Router.json";
import factoryAbi from "../abi/UniswapV2Factory.json";

export default function RemoveLiquidity() {
  const [liquidity, setLiquidity] = useState("");
  const { writeContractAsync } = useWriteContract();
  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  async function removeLiquidity() {
    if(!liquidity){
      return alert("Please enter LP amount");
    }
    try {
      await writeContractAsync({
        address: pairAddress,
        abi: pairAbi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, liquidity],
      });

      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "removeLiquidity",
        args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS, BigInt(liquidity)],
      });
      alert("Liquidity removed 🔥");
    } catch (err) {
      console.error(err);
      alert("Remove liquidity failed");
    }
  }

  return (
    // <div>
    //   <h2>REMOVE LIQUIDITY</h2>
    //   <input
    //     placeholder="LP tokens"
    //     value={liquidity}
    //     onChange={(e) => setLiquidity(e.target.value)}
    //   />
    //   <button onClick={removeLiquidity}>Remove Liquidity</button>
    // </div>




    <div className="flex flex-col items-center justify-center border-amber-100 bg-fuchsia-500 rounded-2xl space-y-7 w-120">

      <h1>Remove Liquidity</h1>

      <input 
      className="w-100 h-10 rounded-2xl bg-fuchsia-800"
      placeholder="LP tokens"
           value={liquidity}
           onChange={(e) => setLiquidity(e.target.value)}
      />

      <button onClick={removeLiquidity} className="w-100 h-10 rounded-2xl bg-fuchsia-800 mb-5">Remove Liquidity</button>

    </div>





  );
}
