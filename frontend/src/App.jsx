import WalletConnect from "./components/WalletConnect";
import Reserves from "./components/Reserves";


function App() {

  return (

    // <div>
    //   <h1 className='text-black'>heloooooooooo</h1>
    //   <div style={{ padding: "20px" }}>
    //   <h2>Uniswap V2 Clone</h2>
    //   <WalletConnect />
    // </div>
    // </div>

    <div className="min-h-screen bg-gray-100 p-8">
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">
        Uniswap V2 Clone
      </h2>

      <WalletConnect />
      <Reserves />
    </div>
  </div>
   
  )
}

export default App;

