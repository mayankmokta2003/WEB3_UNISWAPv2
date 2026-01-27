
import { useEffect, useState } from "react";
import {
  useAccount,
  useReadContract,
  useWriteContract,
} from "wagmi";

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
  const [expectedOut, setExpectedOut] = useState(null);
  const [amountOutMin, setAmountOutMin] = useState(null);
  const [slippage, setSlippage] = useState(1); // %

  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const { data: reserves } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
    query: {
      enabled:
        pairAddress &&
        pairAddress !== "0x0000000000000000000000000000000000000000",
    },
  });

  useEffect(() => {
    if (!amountIn || !reserves) {
      setExpectedOut(null);
      setAmountOutMin(null);
      return;
    }

    const reserve0 = BigInt(reserves[0]);
    const reserve1 = BigInt(reserves[1]);
    const amountInWei = BigInt(amountIn);

    if (amountInWei <= 0n) return;

    const amountInWithFee = amountInWei * 997n;
    const numerator = amountInWithFee * reserve1;
    const denominator = reserve0 * 1000n + amountInWithFee;

    const out = numerator / denominator;

    const minOut =
      (out * BigInt(100 - slippage)) / 100n;

    setExpectedOut(out);
    setAmountOutMin(minOut);
  }, [amountIn, reserves, slippage]);


  async function swap() {
    try {
      if (!amountIn || !amountOutMin) return alert("Invalid input");

      await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amountIn)],
      });

  
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
          Math.floor(Date.now() / 1000) + 60,
        ],
      });

      alert("Swap successful ");
      setAmountIn("");
    } catch (err) {
      console.error(err);
      alert("Swap failed");
    }
  }


  return (
    <div style={{ border: "1px solid #444", padding: 16, marginTop: 20 }}>
      <h3>Swap Token0 → Token1</h3>

      <input
        type="number"
        placeholder="Amount In (wei)"
        value={amountIn}
        onChange={(e) => setAmountIn(e.target.value)}
      />

      <div style={{ marginTop: 10 }}>
        <label>Slippage tolerance (%)</label>
        <input
          type="number"
          value={slippage}
          onChange={(e) => setSlippage(Number(e.target.value))}
          min="0"
          step="0.1"
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <p>
          Expected output:{" "}
          {expectedOut ? expectedOut.toString() : "-"}
        </p>
        <p>
          Minimum received:{" "}
          {amountOutMin ? amountOutMin.toString() : "-"}
        </p>
      </div>

      <button
        onClick={swap}
        disabled={!pairAddress || !amountOutMin}
      >
        Swap
      </button>

      {pairAddress ===
        "0x0000000000000000000000000000000000000000" && (
        <p style={{ color: "red" }}>
          No pool exists for this pair
        </p>
      )}
    </div>
  );
}




























// import { useEffect, useState } from "react";
// import {
//   useAccount,
//   useReadContract,
//   useWriteContract,
// } from "wagmi";

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
//   const [expectedOut, setExpectedOut] = useState(null);
//   const [amountOutMin, setAmountOutMin] = useState("");
//   const [slippage, setSlippage] = useState(1); // %

//   const { data: pairAddress } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: factoryAbi,
//     functionName: "getPair",
//     args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
//   });

//   const { data: reserves } = useReadContract({
//     address: pairAddress,
//     abi: pairAbi,
//     functionName: "getReserves",
//     query: {
//       enabled:
//         pairAddress &&
//         pairAddress !== "0x0000000000000000000000000000000000000000",
//     },
//   });

//   useEffect(() => {
//     if (!amountIn || !reserves) {
//       setExpectedOut(null);
//       // setAmountOutMin(null);
//       return;
//     }

//     const reserve0 = BigInt(reserves[0]);
//     const reserve1 = BigInt(reserves[1]);
//     const amountInWei = BigInt(amountIn);

//     if (amountInWei <= 0n) return;

//     const amountInWithFee = amountInWei * 997n;
//     const numerator = amountInWithFee * reserve1;
//     const denominator = reserve0 * 1000n + amountInWithFee;

//     const out = numerator / denominator;

//     // const minOut =
//     //   (out * BigInt(100 - slippage)) / 100n;

//     setExpectedOut(out);
//     // setAmountOutMin(minOut);
//   }, [amountIn, reserves]);


//   async function swap() {
//     try {
//       // if (!amountIn || !amountOutMin) return alert("Invalid input");
//       if (!amountIn && !amountOutMin) return alert("Invalid input");

//       await writeContractAsync({
//         address: TOKEN0_ADDRESS,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [ROUTER_ADDRESS, BigInt(amountIn)],
//       });

  
//       await writeContractAsync({
//         address: ROUTER_ADDRESS,
//         abi: routerAbi,
//         functionName: "swapExactTokensForTokens",
//         args: [
//           BigInt(amountIn),
//           amountOutMin,
//           TOKEN0_ADDRESS,
//           TOKEN1_ADDRESS,
//           address,
//           Math.floor(Date.now() / 1000) + 60,
//         ],
//       });

//       alert("Swap successful ");
//       setAmountIn("");
//     } catch (err) {
//       console.error(err);
//       alert("Swap failed");
//     }
//   }


//   return (
//     <div style={{ border: "1px solid #444", padding: 16, marginTop: 20 }}>
//       <h3>Swap Token0 → Token1</h3>

//       <input
//         type="number"
//         placeholder="Amount In (wei)"
//         value={amountIn}
//         onChange={(e) => setAmountIn(e.target.value)}
//       />

//       {/* <div style={{ marginTop: 10 }}>
//         <label>Slippage tolerance (%)</label>
//         <input
//           type="number"
//           value={slippage}
//           onChange={(e) => setSlippage(Number(e.target.value))}
//           min="0"
//           step="0.1"
//         />
//       </div> */}


//       <input 
//       type="number"
//       placeholder="Minimum expected Amount In (wei)"
//       value={amountOutMin}
//       onChange={(e) => setAmountOutMin(e.target.value)}
//       />


//       <div style={{ marginTop: 10 }}>
//         <p>
//           Expected output:{" "}
//           {expectedOut ? expectedOut.toString() : "-"}
//         </p>
//         <p>
//           Minimum received:{" "}
//           {amountOutMin ? amountOutMin.toString() : "-"}
//         </p>
//       </div>

//       <button
//         onClick={swap}
//         disabled={!pairAddress || !amountOutMin}
//       >
//         Swap
//       </button>

//       {pairAddress ===
//         "0x0000000000000000000000000000000000000000" && (
//         <p style={{ color: "red" }}>
//           No pool exists for this pair
//         </p>
//       )}
//     </div>
//   );
// }