
// import { useState, useEffect } from "react";
// import {
//   useWriteContract,
//   useReadContract,
//   useAccount,
// } from "wagmi";

// import routerAbi from "../abi/UniswapV2Router.json";
// import pairAbi from "../abi/UniswapV2Pair.json";
// import erc20Abi from "../abi/ERC20.json";

// import {
//   ROUTER_ADDRESS,
//   PAIR_ADDRESS,
//   TOKEN0_ADDRESS,
//   TOKEN1_ADDRESS,
// } from "../config/addresses";

// export default function Swap() {
//   const { address } = useAccount();
//   const { writeContractAsync } = useWriteContract();

//   const [amountIn, setAmountIn] = useState("");
//   const [estimatedOut, setEstimatedOut] = useState("0");

//   // 🔹 read reserves from pair
//   const { data: reserves } = useReadContract({
//     address: PAIR_ADDRESS,
//     abi: pairAbi,
//     functionName: "getReserves",
//   });


// useEffect(() => {
//     if (!amountIn || !reserves) return;
  
//     const amountInBN = BigInt(amountIn);
//     const reserveIn = BigInt(reserves[0]);
//     const reserveOut = BigInt(reserves[1]);
  
//     const amountInWithFee = amountInBN * 997n;
//     const out =
//       (amountInWithFee * reserveOut) /
//       (reserveIn * 1000n + amountInWithFee);
  
//     setEstimatedOut(out.toString());
//   }, [amountIn, reserves]);




//   // 🔹 swap execution
//   async function swap() {
//     try {
//       // approve token0 → router
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
//           0, // minOut (slippage later)
//           [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
//           address,
//           Math.floor(Date.now() / 1000) + 60 * 5,
//         ],
//       });

//       alert("Swap successful 🚀");
//     } catch (err) {
//       console.error(err);
//       alert("Swap failed");
//     }
//   }

//   return (
//     <div className="p-4 border rounded mt-6">
//       <h3 className="font-semibold mb-3">Swap</h3>

//       {/* 👇 YAHI HAI onChange */}
//       <input
//         className="border p-2 w-full mb-3"
//         placeholder="Amount In (wei)"
//         value={amountIn}
//         onChange={(e) => setAmountIn(e.target.value)}
//       />

//       <p className="mb-3">
//         Estimated Output: <b>{estimatedOut}</b>
//       </p>

//       <button
//         onClick={swap}
//         className="bg-green-600 text-white p-2 w-full rounded"
//       >
//         Swap
//       </button>
//     </div>
//   );
// }












import { useState, useEffect } from "react";
import { useReadContract, useWriteContract, useAccount } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import routerAbi from "../abi/UniswapV2Router.json";
import erc20Abi from "../abi/ERC20.json";
import {
  PAIR_ADDRESS,
  ROUTER_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";

export default function Swap() {
  const { address } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const [amountIn, setAmountIn] = useState("");
  const [amountOut, setAmountOut] = useState(0);
  const [priceImpact, setPriceImpact] = useState(0);
  const [slippage, setSlippage] = useState(0.5); // %

  // 🔹 read reserves
  const { data: reserves } = useReadContract({
    address: PAIR_ADDRESS,
    abi: pairAbi,
    functionName: "getReserves",
    watch: true,
  });

  // 🔹 core calculation
  function calculateSwap(input) {
    if (!reserves || !input || Number(input) <= 0) {
      setAmountOut(0);
      setPriceImpact(0);
      return;
    }

    const reserveIn = Number(reserves[0]);
    const reserveOut = Number(reserves[1]);
    const amountInNum = Number(input);

    // 🧮 Uniswap V2 formula
    const amountInWithFee = amountInNum * 997;
    const numerator = amountInWithFee * reserveOut;
    const denominator = reserveIn * 1000 + amountInWithFee;
    const out = numerator / denominator;

    setAmountOut(out);

    // 📉 price impact
    const spotPrice = reserveOut / reserveIn;
    const executionPrice = out / amountInNum;
    const impact = (1 - executionPrice / spotPrice) * 100;

    setPriceImpact(impact);
  }

  // 🔹 input handler (IMPORTANT 🔥)
  function handleInput(e) {
    const value = e.target.value;
    setAmountIn(value);
    calculateSwap(value);
  }

  // 🔹 swap tx
  async function executeSwap() {
    try {
      const amountOutMin =
        amountOut * (1 - slippage / 100);

      // approve token0
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
          BigInt(Math.floor(amountOutMin)),
          [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
          address,
          Math.floor(Date.now() / 1000) + 60,
        ],
      });

      alert("Swap successful 🚀");
      setAmountIn("");
    } catch (err) {
      console.error(err);
      alert("Swap failed ❌");
    }
  }

  return (
    <div style={{ marginTop: "20px" }}>
      <h3>Swap</h3>

      <input
        placeholder="Amount In"
        value={amountIn}
        onChange={handleInput}
      />

      <p>Estimated Output: {amountOut.toFixed(4)}</p>
      <p>Price Impact: {priceImpact.toFixed(2)}%</p>

      {priceImpact > 5 && (
        <p style={{ color: "red" }}>
          ⚠️ High Price Impact
        </p>
      )}

      <button onClick={executeSwap}>Swap</button>
    </div>
  );
}
