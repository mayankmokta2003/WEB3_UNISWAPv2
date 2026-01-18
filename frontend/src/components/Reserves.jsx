import { useReadContract } from "wagmi";
import pairAbii from "../abi/UniswapV2Pair.json";

const PAIR_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

export default function Reserves() {
  const { data, isLoading, error } = useReadContract({
    address: PAIR_ADDRESS,
    abi: pairAbii,
    functionName: "getReserves",
  });

  if (isLoading) return <p>Loading reserves...</p>;
  if (error) return <p>Error fetching reserves</p> && console.log("PAIR_ADDRESS", PAIR_ADDRESS);

  const reserve0 = data[0].toString();
  const reserve1 = data[1];

  return (
    <div>
      <h3>Pool Reserves</h3>

      <div className="flex justify-between">
        <span>Token0</span>
        <span>{reserve0.toString()}</span>
      </div>

      <div className="flex justify-between">
        <span>Token1</span>
        <span>{reserve1.toString()}</span>
      </div>
    </div>
  );
}


// import { useReadContract } from "wagmi";
// import pairAbi from "../abi/UniswapV2Pair.json";

// const PAIR_ADDRESS = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
// const ANVIL_CHAIN_ID = 31337;

// export default function Reserves() {
//   // 1️⃣ READ CONTRACT
//   const {
//     data,
//     isLoading,
//     isError,
//   } = useReadContract({
//     address: PAIR_ADDRESS,
//     abi: pairAbi,
//     functionName: "getReserves",

//     // 🔥 THIS FIXES EVERYTHING
//     chainId: ANVIL_CHAIN_ID,

//     // safety
//     enabled: Boolean(PAIR_ADDRESS),
//   });

//   // 2️⃣ SAFE GUARDS
//   if (isLoading) return <p>Loading reserves...</p>;
//   if (isError || !data) return <p>Error fetching reserves</p>;

//   // 3️⃣ DATA
//   const reserve0 = data[0].toString();
//   const reserve1 = data[1].toString();

//   // 4️⃣ UI
//   return (
//     <div className="mt-6 p-4 border rounded-lg">
//       <h3 className="text-lg font-semibold mb-2">Pool Reserves</h3>

//       <div className="flex justify-between">
//         <span>Token0</span>
//         <span>{reserve0}</span>
//       </div>

//       <div className="flex justify-between">
//         <span>Token1</span>
//         <span>{reserve1}</span>
//       </div>
//     </div>
//   );
// }
