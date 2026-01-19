
import { useState } from "react";
import { useAccount, useWriteContract } from "wagmi";
import erc20Abi from "../abi/ERC20.json";
import erc20Mock from "../abi/ERC20Mock.json"
import routerAbi from "../abi/UniswapV2Router.json"
import pairAbi from "../abi/UniswapV2Pair.json";
import { PAIR_ADDRESS, TOKEN0_ADDRESS, TOKEN1_ADDRESS, ROUTER_ADDRESS } from "../config/addresses";

export default function AddLiquidity() {
  const [amount0, setAmount0] = useState("");
  const [amount1, setAmount1] = useState("");

  // ✅ hook ONLY here
  const { writeContractAsync } = useWriteContract();
  const { address } = useAccount();


  async function addLiquidity() {
    try {
      // token0 approve
      await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amount0)],
      });
  
      // token1 approve
      await writeContractAsync({
        address: TOKEN1_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(amount1)],
      });
  
      // mint (pair pulls tokens internally)
      await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "addLiquidity",
        args: [BigInt(amount0), BigInt(amount1)],
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
