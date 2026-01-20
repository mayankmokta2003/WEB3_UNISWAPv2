// import { useReadContract } from "wagmi";
// import pairAbi from "../abi/UniswapV2Pair.json";
// import factoryAbi from "../abi/UniswapV2Factory.json";
// import {
//   TOKEN0_ADDRESS,
//   TOKEN1_ADDRESS,
//   FACTORY_ADDRESS,
// } from "../config/addresses";

// export default function Reserves() {

//   const { data: pairAddress } = useReadContract({
//     address: FACTORY_ADDRESS,
//     abi: factoryAbi,
//     functionName: "getPair",
//     args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
//   });

//   const { data: reserves, isLoading } = useReadContract({
//     address: pairAddress,
//     abi: pairAbi,
//     functionName: "getReserves",
//   });

//   console.log("blablablabla", reserves?.toString());

//   if (isLoading || !reserves) return <p>Loading reserves...</p>;

//   return (
//     <div>
//       <p>Token0: {reserves[0].toString()}</p>
//       <p>Token1: {reserves[1].toString()}</p>
//     </div>
//   );
// }






import { useReadContract } from "wagmi";
import pairAbi from "../abi/UniswapV2Pair.json";

export default function Reserves({ pairAddress }) {
  const { data, isLoading } = useReadContract({
    address: pairAddress,
    abi: pairAbi,
    functionName: "getReserves",
    enabled: !!pairAddress,
    watch: true,
  });

  if (!pairAddress) return <p>Select tokens</p>;
  if (isLoading) return <p>Loading reserves...</p>;
  if (!data) return <p>No pool exists</p>;

  return (
    <div>
      <p>Reserve0: {data[0].toString()}</p>
      <p>Reserve1: {data[1].toString()}</p>
    </div>
  );
}
