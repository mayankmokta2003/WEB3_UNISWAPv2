import { useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";
import erc20Abi from "../abi/ERC20.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import {
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
  FACTORY_ADDRESS,
} from "../config/addresses";

export default function Reserves() {

  const { data: r0 } = useReadContract({
    address: TOKEN0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
  })

  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const { data: reserves, isLoading } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
  });

  console.log("blablablabla", reserves?.toString());
  console.log("bla", pairAddress);

  if (isLoading || !reserves) return <p>Loading reserves...</p>;

  return (
    <div>
      <p>Token0: {reserves[0].toString()}</p>
      <p>Token1: {reserves[1].toString()}</p>
    </div>
  );
}




// import { useReadContract } from "wagmi";
// import pairAbi from "../abi/UniswapV2Pair.json";
// import factoryAbi from "../abi/UniswapV2Factory.json";
// import { TOKEN0_ADDRESS, TOKEN1_ADDRESS, FACTORY_ADDRESS } from "../config/addresses";

// export default function Reserves() {

//   const { data: pairAddress } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: factoryAbi,
//     functionName: "getPair",
//     args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
//     watch: true,
//   });

//   const hasPair =
//     pairAddress &&
//     pairAddress !== "0x0000000000000000000000000000000000000000";

//   const { data: reserves } = useReadContract({
//     address: hasPair ? pairAddress : undefined,
//     abi: pairAbi,
//     functionName: "getReserves",
//     watch: true,
//     enabled: hasPair,
//   });

//   if (!hasPair) {
//     return <p>No pool created yet</p>;
//   }

//   if (!reserves) {
//     return <p>Loading reserves...</p>;
//   }

//   return (
//     <div>
//       <p>Token0: {reserves[0].toString()}</p>
//       <p>Token1: {reserves[1].toString()}</p>
//     </div>
//   );
// }
