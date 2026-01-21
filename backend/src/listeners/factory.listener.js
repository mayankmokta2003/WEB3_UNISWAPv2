import factoryAbi from "../abi/UniswapV2Factory.json";
import { client } from "../config/viem.js";
import Pool from "../models/Pool.js";
import { FACTORY_ADDRESS } from "../config/addresses.js";

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
          token0,
          token1,
          pairAddress: pair,
        });
      }
    },
  });
}
