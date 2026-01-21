import { client } from "../config/viem";
import pairAbi from "../abi/UniswapV2Pair.json";

export async function getReserves(pairAddress) {

    const reserves = await client.readContract({
        address: pairAddress,
        abi: pairAbi,
        functionName: "getReserves",
    });

    return{
        reserve0: reserves[0].toString(),
        reserve1: reserves[1].toString(),
    };

}