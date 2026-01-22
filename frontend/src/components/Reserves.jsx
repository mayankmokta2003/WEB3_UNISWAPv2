import pairAbi from "../abi/UniswapV2Pair.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import {
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
  FACTORY_ADDRESS,
} from "../config/addresses";
import { useReadContract, useWatchContractEvent } from "wagmi";

export default function Reserves() {
  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const {
    data: reserves,
    isLoading,
    refetch,
  } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
    enabled: !!pairAddress,
  });

  useWatchContractEvent({
    address: pairAddress,
    abi: pairAbi,
    eventName: "Sync",
    enabled: !!pairAddress,
    onLogs() {
      refetch();
    },
  });

  if (isLoading || !reserves) {
    return <p>Loading reserves...</p>;
  }

  return (
    <div>
      <p>Token0: {reserves[0].toString()}</p>
      <p>Token1: {reserves[1].toString()}</p>
    </div>
  );
}
