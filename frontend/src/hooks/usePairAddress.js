import { useReadContract } from "wagmi";
import factoryAbi from "../abi/UniswapV2Factory.json";
import { FACTORY_ADDRESS } from "../config/addresses";

export function usePairAddress(tokenA, tokenB) {
  return useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [tokenA, tokenB],
    enabled: !!tokenA && !!tokenB,
  });
}
