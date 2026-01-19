
import { useState, useEffect } from "react";
import {
  useWriteContract,
  useReadContract,
  useAccount,
} from "wagmi";

import routerAbi from "../abi/UniswapV2Router.json";
import pairAbi from "../abi/UniswapV2Pair.json";
import erc20Abi from "../abi/ERC20.json";

import {
  ROUTER_ADDRESS,
  PAIR_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";

export default function Swap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amountIn, setAmountIn] = useState("");
  const [estimatedOut, setEstimatedOut] = useState("0");

  // 🔹 read reserves from pair
  const { data: reserves } = useReadContract({
    address: PAIR_ADDRESS,
    abi: pairAbi,
    functionName: "getReserves",
  });

  // 🔹 calculate amountOut whenever input or reserves change
//   useEffect(() => {
//     if (!amountIn || !reserves) {
//       setEstimatedOut("0");
//       return;
//     }

//     try {
//       const reserveIn = reserves[0];
//       const reserveOut = reserves[1];

//       const amountInBN = BigInt(amountIn);

//       const amountInWithFee = amountInBN * 997n;
//       const numerator = amountInWithFee * reserveOut;
//       const denominator = reserveIn * 1000n + amountInWithFee;

//       const out = numerator / denominator;
//       setEstimatedOut(out.toString());
//     } catch {
//       setEstimatedOut("0");
//     }
//   }, [amountIn, reserves]);



useEffect(() => {
    if (!amountIn || !reserves) return;
  
    const amountInBN = BigInt(amountIn);
    const reserveIn = BigInt(reserves[0]);
    const reserveOut = BigInt(reserves[1]);
  
    const amountInWithFee = amountInBN * 997n;
    const out =
      (amountInWithFee * reserveOut) /
      (reserveIn * 1000n + amountInWithFee);
  
    setEstimatedOut(out.toString());
  }, [amountIn, reserves]);




  // 🔹 swap execution
  async function swap() {
    try {
      // approve token0 → router
      await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amountIn)],
      });

      // swap
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "swapExactTokensForTokens",
        args: [
          BigInt(amountIn),
          0, // minOut (slippage later)
          [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
          address,
          Math.floor(Date.now() / 1000) + 60 * 5,
        ],
      });

      alert("Swap successful 🚀");
    } catch (err) {
      console.error(err);
      alert("Swap failed");
    }
  }

  return (
    <div className="p-4 border rounded mt-6">
      <h3 className="font-semibold mb-3">Swap</h3>

      {/* 👇 YAHI HAI onChange */}
      <input
        className="border p-2 w-full mb-3"
        placeholder="Amount In (wei)"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />

      <p className="mb-3">
        Estimated Output: <b>{estimatedOut}</b>
      </p>

      <button
        onClick={swap}
        className="bg-green-600 text-white p-2 w-full rounded"
      >
        Swap
      </button>
    </div>
  );
}
