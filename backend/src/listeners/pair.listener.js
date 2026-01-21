import { client } from "../config/viem.js";
import { loadAbi } from "../utils/loadAbi.js";
// import pairAbi from "../abi/UniswapV2Pair.json";
const pairAbi = loadAbi("src/abi/UniswapV2Pair.json");
import Pool from "../models/Pool.js";

export function listenToPair(pairAddress) {
  console.log("Listening to Pair:", pairAddress);

  client.watchContractEvent({
    address: pairAddress,
    abi: pairAbi,
    eventName: "Sync",
    onLogs: async (logs) => {
      for (const log of logs) {
        const { reserve0, reserve1 } = log.args;
        await Pool.findOneAndUpdate(
          { pairAddress },
          {
            reserve0: reserve0.toString(),
            reserve1: reserve1.toString(),
          }
        );
      }
    },
  });

  client.watchContractEvent({
    address: pairAddress,
    abi: pairAbi,
    eventName: "Swap",
    onLogs: async (logs) => {
      for (const log of logs) {
        const { amount0In, amount1In, amount0Out, amount1Out } = log.args;
        Pool.findOneAndUpdate(
          { pairAddress },
          {
            $inc: {
              volumeToken0: amount0In.toString(),
              volumeToken1: amount1In.toString(),
            },
          }
        );
      }
    },
  });
}
