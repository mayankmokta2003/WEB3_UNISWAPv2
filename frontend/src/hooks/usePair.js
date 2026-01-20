import { useReadContract } from "wagmi";
import factoryAbi from "../abi/UniswapV2Factory.json";
import { FACTORY_ADDRESS } from "../config/addresses";

export function usePair(tokenA, tokenB) {
  const enabled = !!tokenA && !!tokenB;

  const { data: pairAddress, isLoading } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: enabled ? [tokenA, tokenB] : undefined,
    query: {
      enabled,
      watch: true,
    },
  });

  const exists =
    pairAddress &&
    pairAddress !== "0x0000000000000000000000000000000000000000";

  return {
    pairAddress,
    exists,
    isLoading,
  };
}
