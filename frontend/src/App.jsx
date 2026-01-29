import Navbar from "./components/Navbar";
import AddLiquidity from "./components/AddLiquidity";
import RemoveLiquidity from "./components/RemoveLiquidity";
import Swap from "./components/Swap";
import LPDashboard from "./components/LPDashboard";
import Balance from "./components/Balance";

function App() {
  return (
    <div className="bg-black text-white flex flex-col items-center justify-center gap-10">
      <Navbar />
      <AddLiquidity />
      <RemoveLiquidity />
      <Swap />
      <LPDashboard />
      <Balance />
      {/* <Pools />  */}
    </div>
  );
}

export default App;
