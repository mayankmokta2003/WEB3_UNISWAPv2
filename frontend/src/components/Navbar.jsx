import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";
import logo from "../../images/logo.png";
import icon2 from "../../images/icon2.png";
import icon3 from "../../images/icon3.png";
import icon4 from "../../images/icon4.png";
import icon5 from "../../images/icon5.png";
import icon7 from "../../images/icon7.png";

export default function Navbar() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <div className="text-white bg-black">
      <div className="flex flex-row items-center justify-between pt-1 pb-1 pl-20 pr-20">
        <div>
          <img src={logo} className="w-40 cursor-pointer" />
        </div>

        <div className="flex flex-row gap-20">
          <h3 className="cursor-pointer">helooo</h3>
          <h3 className="cursor-pointer">helooo</h3>
          <h3 className="cursor-pointer">helooo</h3>
        </div>
      </div>

      <hr />

      <div className="flex flex-col items-center justify-center mt-20">
        <div className="flex flex-row gap-60">
          <img src={icon2} className="w-40 rounded-full" />
          <img src={icon7} className="w-40" />
          <img src={icon3} className="w-60 h-40 rounded-full" />
        </div>

        <div className="flex ">
          <h1 className="text-5xl">
            The most customizable, <br />
            lowest cost version of the <br /> Uniswap Protocol
          </h1>
        </div>

        <div className="flex flex-row gap-60 mt-10">
          <img src={icon5} className="w-40 rounded-full" />

          <div className="flex flex-col items-center justify-center space-y-4">
            {!isConnected ? (
              <div
                className="bg-amber-900 h-10 w-49 flex items-center justify-center cursor-pointer rounded-4xl"
                onClick={() => connect({ connector: injected() })}
              >
                <h1>Connect Wallet</h1>
              </div>
            ) : (
              <div
                className="bg-amber-500 h-10 w-49 flex items-center justify-center cursor-pointer rounded-4xl"
                onClick={disconnect}
              >
                <h1>Disconnect Wallet</h1>
              </div>
            )}

            {address ? <p>{address}</p> : <p>Please connect your wallet</p>}
          </div>

          {/* <div className="bg-amber-900 h-10 w-49 flex items-center justify-center cursor-pointer">
                    <h1>Connect Wallet</h1>
                </div> */}

          <img src={icon4} className="w-60 h-40 rounded-full" />
        </div>
      </div>
    </div>
  );
}
