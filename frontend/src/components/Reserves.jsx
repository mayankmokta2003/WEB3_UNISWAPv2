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
    <div className="flex flex-row items-center justify-center gap-40">
      <div className="bg-green-950 h-40 w-40 rounded-2xl flex flex-col items-center justify-center space-y-10 ">
        <h1 className="text-green-400 font-semibold">Token0 Reserves</h1>
        <h1 className="text-green-600 text-3xl font-extrabold">
          {reserves[0].toString()}
        </h1>
      </div>

      <div className="bg-green-950 h-40 w-40 rounded-2xl flex flex-col items-center justify-center space-y-10 ">
        <h1 className="text-green-400 font-semibold">Token1 Reserves</h1>
        <h1 className="text-green-600 text-3xl font-extrabold">
          {reserves[1].toString()}
        </h1>
      </div>
    </div>
  );
}
