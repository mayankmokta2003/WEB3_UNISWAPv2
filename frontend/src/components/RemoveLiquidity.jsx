import { useState } from "react";
import { useWriteContract } from "wagmi"
import { PAIR_ADDRESS, ROUTER_ADDRESS, TOKEN0_ADDRESS, TOKEN1_ADDRESS } from "../config/addresses";
import pairAbi from "../abi/UniswapV2Pair.json"
import routerAbi from "../abi/UniswapV2Router.json";


export default function RemoveLiquidity() {

    const [liquidity, setLiquidity] = useState("");
    const { writeContractAsync } = useWriteContract();

    async function removeLiquidity() {
        try {
            await writeContractAsync({
                address: PAIR_ADDRESS,
                abi: pairAbi,
                functionName: "approve",
                args: [ROUTER_ADDRESS, liquidity]
            });
    
            await writeContractAsync({
                address: ROUTER_ADDRESS,
                abi: routerAbi,
                functionName: "removeLiquidity",
                args: [
                    BigInt(liquidity), window.ethereum.selectedAddress, Math.floor(Date.now() / 1000) + 60
                ]
            });
            alert("Liquidity removed 🔥");
        } catch (err) {
            console.error(err);
            alert("Remove liquidity failed");
        }
    }

    return(
        <div>
            <h2>REMOVE LIQUIDITY</h2>
      <input
        placeholder="LP tokens"
        value={liquidity}
        onChange={(e) => setLiquidity(e.target.value)}
      />
      <button onClick={removeLiquidity}>Remove Liquidity</button>
    </div>
    )

}