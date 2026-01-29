import { client } from "../config/viem.js";
import { loadAbi } from "../utils/loadAbi.js";
const pairAbi = loadAbi("src/abi/UniswapV2Pair.json");
import Pool from "../models/Pool.js";
import { calculatePrices } from "../utils/calcPrice.js";

export async function listenToPair(pairAddress) {
  console.log("Listening to Pair:", pairAddress);

  const [reserve0, reserve1] = await client.readContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
  });

  const prices = calculatePrices(reserve0, reserve1);

  await Pool.findOneAndUpdate(
    { pairAddress },
    {
      reserve0: reserve0.toString(),
      reserve1: reserve1.toString(),
      ...prices,
    },
    { upsert: true }
  );

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
            ...prices,
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

        const vol0 = amount0In > 0n ? amount0In : amount0Out;
        const vol1 = amount1In > 0n ? amount1In : amount1Out;

        await Pool.findOneAndUpdate(
          { pairAddress },
          {
            $inc: {
              volumeToken0: Number(vol0),
              volumeToken1: Number(vol1),
            },
          }
        );
      }
    },
  });
}
