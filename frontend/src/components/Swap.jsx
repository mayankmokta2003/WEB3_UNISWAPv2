
// import { useEffect, useState } from "react";
// import { useAccount, useReadContract, useWriteContract } from "wagmi";
// import routerAbi from "../abi/UniswapV2Router.json";
// import factoryAbi from "../abi/UniswapV2Factory.json";
// import pairAbi from "../abi/UniswapV2Pair.json";
// import erc20Abi from "../abi/ERC20.json";

// import {
//   ROUTER_ADDRESS,
//   FACTORY_ADDRESS,
//   TOKEN0_ADDRESS,
//   TOKEN1_ADDRESS,
// } from "../config/addresses";

// export default function Swap() {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();

//   const [amountIn, setAmountIn] = useState("");
//   const [amountOut, setAmountOut] = useState("0");

//   // Pair address
//   const { data: pairAddress } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: factoryAbi,
//     functionName: "getPair",
//     args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
//   });

//   // Reserves
//   const { data: reserves } = useReadContract({
//     address: pairAddress,
//     abi: pairAbi,
//     functionName: "getReserves",
//     enabled: !!pairAddress && pairAddress !== "0x0000000000000000000000000000000000000000",
//   });

//   // Expected output calculation
//   useEffect(() => {
//     if (!amountIn || !reserves) {
//       setAmountOut("0");
//       return;
//     }

//     const reserveIn = BigInt(reserves[0]);
//     const reserveOut = BigInt(reserves[1]);
//     const input = BigInt(amountIn);

//     if (input === 0n) {
//       setAmountOut("0");
//       return;
//     }

//     // Uniswap formula with fee
//     const amountInWithFee = input * 997n;
//     const numerator = amountInWithFee * reserveOut;
//     const denominator = reserveIn * 1000n + amountInWithFee;
//     const output = numerator / denominator;

//     setAmountOut(output.toString());
//   }, [amountIn, reserves]);

//   // Swap function
//   async function swap() {
//     try {
//       // approve token0
//       await writeContractAsync({
//         address: TOKEN0_ADDRESS,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [ROUTER_ADDRESS, BigInt(amountIn)],
//       });

//       // swap
//       await writeContractAsync({
//         address: ROUTER_ADDRESS,
//         abi: routerAbi,
//         functionName: "swapExactTokensForTokens",
//         args: [
//           BigInt(amountIn),
//           0, 
//           TOKEN0_ADDRESS,
//           TOKEN1_ADDRESS,
//           address,
//           Math.floor(Date.now() / 1000) + 60, 
//         ],
//       });

//       alert("Swap successful 🚀");
//     } catch (err) {
//       console.error(err);
//       alert("Swap failed");
//     }
//   }

//   if (!pairAddress || pairAddress === "0x0000000000000000000000000000000000000000") {
//     return <p>No pool exists</p>;
//   }

//   return (
//     <div className="p-4 border rounded mt-6">
//       <h3>Swap</h3>

//       <input
//         placeholder="Amount In (Token0)"
//         value={amountIn}
//         onChange={(e) => setAmountIn(e.target.value)}
//       />

//       <p>Expected Output (Token1): {amountOut}</p>

//       <button onClick={swap}>Swap</button>
//     </div>
//   );
// }





import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract } from "wagmi";
import routerAbi from "../abi/UniswapV2Router.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import pairAbi from "../abi/UniswapV2Pair.json";
import erc20Abi from "../abi/ERC20.json";
import {
  ROUTER_ADDRESS,
  FACTORY_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";

export default function Swap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amountIn, setAmountIn] = useState("");
  const [expectedOut, setExpectedOut] = useState("0");
  const [slippage, setSlippage] = useState(1); // %
  const [deadlineMinutes, setDeadlineMinutes] = useState(5);

  // 1️⃣ Get pair
  const { data: pair } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  // 2️⃣ Get reserves
  const { data: reserves } = useReadContract({
    address: pair,
    abi: pairAbi,
    functionName: "getReserves",
    query: {
      enabled:
        pair &&
        pair !== "0x0000000000000000000000000000000000000000",
    },
  });

  // 3️⃣ Calculate expected output
  useEffect(() => {
    if (!amountIn || !reserves) {
      setExpectedOut("0");
      return;
    }

    const amountInBN = BigInt(amountIn);
    const reserve0 = BigInt(reserves[0]);
    const reserve1 = BigInt(reserves[1]);

    if (amountInBN === 0n || reserve0 === 0n || reserve1 === 0n) {
      setExpectedOut("0");
      return;
    }

    // Uniswap formula with fee
    const amountInWithFee = amountInBN * 997n;
    const numerator = amountInWithFee * reserve1;
    const denominator = reserve0 * 1000n + amountInWithFee;
    const out = numerator / denominator;

    setExpectedOut(out.toString());
  }, [amountIn, reserves]);

  // 4️⃣ Swap
  async function swap() {
    try {
      const amountOutMin =
        (BigInt(expectedOut) * BigInt(100 - slippage)) / 100n;

      const deadline =
        Math.floor(Date.now() / 1000) + deadlineMinutes * 60;

      // approve
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
          amountOutMin,
          TOKEN0_ADDRESS,
          TOKEN1_ADDRESS,
          address,
          BigInt(deadline),
        ],
      });

      alert("Swap successful 🚀");
    } catch (err) {
      console.error(err);
      alert("Swap failed ❌");
    }
  }

  return (
    <div className="p-4 border rounded-lg mt-6">
      <h3>Swap</h3>

      <input
        placeholder="Amount In (Token0)"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />

      <p>Expected Output (Token1): {expectedOut}</p>

      <hr />

      <label>Slippage (%)</label>
      <input
        value={slippage}
        onChange={(e) => setSlippage(Number(e.target.value))}
      />

      <label>Deadline (minutes)</label>
      <input
        value={deadlineMinutes}
        onChange={(e) => setDeadlineMinutes(Number(e.target.value))}
      />

      <button onClick={swap}>Swap</button>
    </div>
  );
}
