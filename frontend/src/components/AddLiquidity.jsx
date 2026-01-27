
import { useState } from "react";
import { usePublicClient, useWriteContract } from "wagmi";
import erc20Abi from "../abi/ERC20.json";
import routerAbi from "../abi/UniswapV2Router.json";
import {
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
  ROUTER_ADDRESS,
} from "../config/addresses";
import Reserves from "./Reserves";

export default function AddLiquidity() {
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");

  const { writeContractAsync } = useWriteContract();
  const publicClient = usePublicClient();

  async function addLiquidity() {
    try {
      if (!amountA || !amountB) {
        alert("Enter both amounts");
        return;
      }

      const MAX_UINT = BigInt("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff");

      const approveTx0 = await writeContractAsync({
        address: TOKEN0_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(MAX_UINT)],
      });

      await publicClient.waitForTransactionReceipt({
        hash: approveTx0,
      });

      const approveTx1 = await writeContractAsync({
        address: TOKEN1_ADDRESS,
        abi: erc20Abi,
        functionName: "approve",
        args: [ROUTER_ADDRESS, BigInt(MAX_UINT)],
      });

      await publicClient.waitForTransactionReceipt({
        hash: approveTx1,
      });

      const addLiqTx = await writeContractAsync({
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

      await publicClient.waitForTransactionReceipt({
        hash: addLiqTx,
      });
      
      alert("Liquidity added successfully 🚀");
      setAmountA("");
      setAmountB("");
    } catch (err) {
      console.error(err);
      alert("Add liquidity failed");
    }
  }

  return (
    // <div>
    //   <h3>Add Liquidity</h3>

    //   <input
    //     placeholder="Amount Token0"
    //     value={amountA}
    //     onChange={(e) => setAmountA(e.target.value)}
    //   />

    //   <input
    //     placeholder="Amount Token1"
    //     value={amountB}
    //     onChange={(e) => setAmountB(e.target.value)}
    //   />

    //   <button onClick={addLiquidity}>Add Liquidity</button>
    // </div>










    <div className="flex flex-col justify-center items-center gap-10">

      <div>
        <h1 className="text-5xl">ADD & REMOVE LIQUIDITY</h1>
      </div>


    <div className="flex flex-col items-center justify-center border-amber-100 bg-fuchsia-500 rounded-2xl space-y-7 w-120">

    <h1>Add liquidity from here  UNISWAPv2</h1>

    <input 
    className=" w-100 h-10 rounded-2xl bg-fuchsia-800"
    placeholder="Token0 Amount"
    value={amountA}
    onChange={(e) => setAmountA(e.target.value)}
    />


    <input 
    className="w-100 h-10 rounded-2xl bg-fuchsia-800"
    placeholder="Token1 Amount"
    value={amountB}
    onChange={(e) => setAmountB(e.target.value)}
    />

    <button onClick={addLiquidity} className="w-100 h-10 rounded-2xl bg-fuchsia-800 mb-5">Add liquidity</button>

    </div>


    <div>
      <Reserves />
    </div>

    </div>











  );
}



