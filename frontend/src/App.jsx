import Navbar from "./components/Navbar";
import WalletConnect from "./components/WalletConnect";
import Reserves from "./components/Reserves";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import Swap from "./components/Swap";
import LPDashboard from "./components/LPDashboard";
import Pools from "./components/Pools";

function App() {

  return (

//   <div>
//     <Navbar />
// <div className="min-h-screen bg-gray-100 p-8">
//       <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
//         <h2 className="text-2xl font-bold mb-4 text-center">
//           Uniswap V2 Clone
//         </h2>
//         {/* <WalletConnect /> */}
//         <Reserves />
//         {/* <AddLiquidity /> */}
//         <RemoveLiquidity />
//         <Swap />
//         <LPDashboard />
//         <Pools />
//       </div>
//     </div>



//   </div>











<div className="bg-black text-white flex flex-col items-center justify-center gap-10 mb-100">
    <Navbar />
        <AddLiquidity />
        <RemoveLiquidity />
        <Swap />
        {/* <LPDashboard />
        <Pools />  */}
  </div> 




   
  )
}

export default App;





