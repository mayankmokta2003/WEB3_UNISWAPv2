
import { useState } from "react";
import { useWriteContract } from "wagmi";
import erc20Abi from "../abi/ERC20.json";
import routerAbi from "../abi/UniswapV2Router.json";
import {
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
  ROUTER_ADDRESS,
} from "../config/addresses";

export default function AddLiquidity() {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const { writeContractAsync } = useWriteContract();

  async function addLiquidity() {
    try {
      if (!amountA || !amountB) {
        alert("Enter both amounts");
        return;
      }

      // ✅ approve tokenA → router
      await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amountA)],
      });

      // ✅ approve tokenB → router
      await writeContractAsync({
        address: TOKEN1_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amountB)],
      });

      // ✅ router.addLiquidity(tokenA, tokenB, amountA, amountB)
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "addLiquidity",
        args: [
          TOKEN0_ADDRESS,
          TOKEN1_ADDRESS,
          BigInt(amountA),
          BigInt(amountB),
        ],
      });

      alert("Liquidity added successfully 🚀");
    } catch (err) {
      console.error(err);
      alert("Add liquidity failed");
    }
  }

  return (
    <div>
      <h3>Add Liquidity</h3>

      <input
        placeholder="Amount Token0"
        value={amountA}
        onChange={(e) => setAmountA(e.target.value)}
      />

      <input
        placeholder="Amount Token1"
        value={amountB}
        onChange={(e) => setAmountB(e.target.value)}
      />

      <button onClick={addLiquidity}>Add Liquidity</button>
    </div>
  );
}



