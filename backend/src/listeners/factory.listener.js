import { loadAbi } from "../utils/loadAbi.js";
const factoryAbi = loadAbi("src/abi/UniswapV2Factory.json");
import { client } from "../config/viem.js";
import Pool from "../models/Pool.js";
import { FACTORY_ADDRESS } from "../config/addresses.js";
import { listenToPair } from "./pair.listener.js";

export function listenToFactoryEvents() {
  console.log("Listening to Factory events...");

  client.watchContractEvent({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    eventName: "PairCreated",
    onLogs: async (logs) => {
      for (const log of logs) {
        const { token0, token1, pair } = log.args;
        console.log("Pair created:", pair);

        await Pool.create({
          pairAddress: pair,
          token0,
          token1,
          reserve0: "0",
          reserve1: "0",
          volumeToken0: "0",
          volumeToken1: "0",
        });
        listenToPair(pair);
      }
    },
  });
}
