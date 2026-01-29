import { useState } from "react";
import {
  useAccount,
  usePublicClient,
  useReadContract,
  useWriteContract,
} from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import routerAbi from "../abi/UniswapV2Router.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import {
  FACTORY_ADDRESS,
  ROUTER_ADDRESS,
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
} from "../config/addresses";

export default function RemoveLiquidity() {
  const { address } = useAccount();
  const publicClient = usePublicClient();
  const { writeContractAsync } = useWriteContract();
  const [lpAmount, setLpAmount] = useState("");

  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const { data: lpBalance } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "balanceOf",
    args: [address],
    enabled: !!pairAddress && !!address,
  });

  async function removeLiquidity() {
    const amount = BigInt(lpAmount);
    if (!amount || amount <= 0n) return alert("Invalid LP amount");
    if (lpBalance && amount > lpBalance) return alert("Not enough LP");

    try {
      const approveTx = await writeContractAsync({
        address: pairAddress,
        abi: pairAbi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, amount],
      });

      await publicClient.waitForTransactionReceipt({ hash: approveTx });

      const removeTx = await writeContractAsync({
        address: ROUTER_ADDRESS,
        abi: routerAbi,
        functionName: "removeLiquidity",
        args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS, amount],
      });

      await publicClient.waitForTransactionReceipt({ hash: removeTx });

      alert("Liquidity removed successfully");
      setLpAmount("");
    } catch (e) {
      console.error(e);
      alert("Remove liquidity failed");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center border-amber-100 bg-fuchsia-500 rounded-2xl space-y-7 w-120">
      <h1>Remove Liquidity</h1>

      <input
        className="w-100 h-10 rounded-2xl bg-fuchsia-800"
        placeholder="LP tokens"
        value={lpAmount}
        onChange={(e) => setLpAmount(e.target.value)}
      />

      <button
        onClick={removeLiquidity}
        className="w-100 h-10 rounded-2xl bg-fuchsia-800 mb-5"
      >
        Remove Liquidity
      </button>
    </div>
  );
}
