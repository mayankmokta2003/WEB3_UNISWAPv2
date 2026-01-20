
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import erc20Abi from "../abi/ERC20.json";
import routerAbi from "../abi/UniswapV2Router.json"
import { TOKEN0_ADDRESS, TOKEN1_ADDRESS, ROUTER_ADDRESS } from "../config/addresses";

export default function AddLiquidity() {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  // ✅ hook ONLY here
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();


  async function addLiquidity() {
    try {
      await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amount0)],
      });
  
      await writeContractAsync({
        address: TOKEN1_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amount1)],
      });
  
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "addLiquidity",
        args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS, BigInt(amount0), BigInt(amount1)],
      });
  
      alert("Liquidity added successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Add liquidity failed");
    }
  }
  
  return (
    <div className="mt-6 p-4 border rounded-lg">
      <h3>Add Liquidity</h3>

      <input
        value={amount0}
        onChange={(e) => setAmount0(e.target.value)}
        placeholder="Amount Token0 (wei)"
      />

      <input
        value={amount1}
        onChange={(e) => setAmount1(e.target.value)}
        placeholder="Amount Token1 (wei)"
      />

      <button onClick={addLiquidity}>
        Add Liquidity
      </button>

    </div>
  );
}






// import { useState } from "react";
// import { useWriteContract } from "wagmi";
// import erc20Abi from "../abi/ERC20.json";
// import routerAbi from "../abi/UniswapV2Router.json";
// import { ROUTER_ADDRESS } from "../config/addresses";

// export default function AddLiquidity({ tokenA, tokenB }) {
//   const [amountA, setAmountA] = useState("");
//   const [amountB, setAmountB] = useState("");
//   const { writeContractAsync } = useWriteContract();

//   async function addLiquidity() {
//     try {
//       await writeContractAsync({
//         address: tokenA,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [ROUTER_ADDRESS, BigInt(amountA)],
//       });

//       await writeContractAsync({
//         address: tokenB,
//         abi: erc20Abi,
//         functionName: "approve",
//         args: [ROUTER_ADDRESS, BigInt(amountB)],
//       });

//       // await writeContractAsync({
//       //   address: ROUTER_ADDRESS,
//       //   abi: routerAbi,
//       //   functionName: "addLiquidity",
//       //   args: [amountA, amountB,],
//       // });

//       await writeContractAsync({
//         address: ROUTER_ADDRESS,
//         abi: routerAbi,
//         functionName: "addLiquidity",
//         args: [tokenA, tokenB, amountA, amountB,],
//       });

//       alert("Liquidity added 🚀");
//     } catch (e) {
//       console.error(e);
//       alert("Failed");
//     }
//   }

//   return (
//     <div>
//       <input
//         placeholder="Amount A"
//         value={amountA}
//         onChange={(e) => setAmountA(e.target.value)}
//       />
//       <input
//         placeholder="Amount B"
//         value={amountB}
//         onChange={(e) => setAmountB(e.target.value)}
//       />
//       <button onClick={addLiquidity}>Add Liquidity</button>
//     </div>
//   );
// }
