import { createPublicClient, http } from "viem";
import { localhost } from "viem/chains";

export const client = createPublicClient({
    chain: localhost,
    transport: http("http://127.0.0.1:8545"),
});

