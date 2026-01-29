import { createConfig, http } from "wagmi";
// import { sepolia } from "wagmi/chains";
import { anvil } from "wagmi/chains";

// export const wagmiConfig = createConfig({
//     chains: [sepolia],
//     transports: {
//         [sepolia.id]: http(),
//     },
// });

export const wagmiConfig = createConfig({
  chains: [anvil],
  transports: {
    [anvil.id]: http("http://127.0.0.1:8545"),
  },
});
