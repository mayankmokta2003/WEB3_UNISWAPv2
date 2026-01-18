import { useState } from "react";
import { useWriteContract } from "wagmi";
import erc20Abi from "../abi/ERC20.json"
import pairAbi from "../abi/UniswapV2Pair.json";
import { PAIR_ADDRESS, TOKEN0_ADDRESS, TOKEN1_ADDRESS } from "../config/addresses";


export default function AddLiquidity() {

    const [amount0, setAmount0] = useState("");
    const [amount1, setAmount1] = useState("");

    const { writeContractAsync } = useWriteContract();

    async function addLiquidity() {
        try {

            await writeContractAsync({
                address: TOKEN0_ADDRESS,
                abi: erc20Abi,
                functionName: "transfer",
                args: [PAIR_ADDRESS, BigInt(amount0)],
            });

            await writeContractAsync({
                address: TOKEN1_ADDRESS,
                abi: erc20Abi,
                functionName: "transfer",
                args: [PAIR_ADDRESS, BigInt(amount1)],
            })

            await writeContractAsync({
                address: PAIR_ADDRESS,
                abi: pairAbi,
                functionName: "mint",
            })
            alert("Liquidity added successfully 🚀");

        } catch (err) {
            console.error(err);
            alert("Error adding liquidity");
        }

    }


    return(

        <div className="mt-6 p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Add Liquidity</h3>

      <input
        className="border p-2 w-full mb-2"
        placeholder="Amount Token0 (wei)"
        value={amount0}
        onChange={(e) => setAmount0(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-4"
        placeholder="Amount Token1 (wei)"
        value={amount1}
        onChange={(e) => setAmount1(e.target.value)}
      />

      <button
        onClick={addLiquidity}
        className="w-full bg-blue-600 text-white p-2 rounded"
      >
        Add Liquidity
      </button>
    </div>

    )
    
}