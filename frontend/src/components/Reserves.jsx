import { useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";

const PAIR_ADDRESS = "0x34a1d3fff3958843c43ad80f30b94c510645c316";

export default function Reserves() {

    const { data, isLoading, error } = useReadContract({
        address: PAIR_ADDRESS,
        abi: pairAbi,
        functionName: "getReserves"
    });

    if(isLoading) return <p>Loading reserves...</p>
    if(error) return <p>Error fetching reserves</p>
    const reserve0 = data[0];
    const reserve1 = data[1];


    return(

        <div>
            <h3>Pool Reserves</h3>

            <div className="flex justify-between">
            <span>Token0</span>
            <span>{reserve0.toString()}</span>
            </div>

            <div className="flex justify-between">
                <span>Token1</span>
                <span>{reserve1.toString()}</span>
            </div>

        </div>

    )

}