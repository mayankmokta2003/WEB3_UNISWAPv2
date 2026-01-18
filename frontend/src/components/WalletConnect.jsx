import { useAccount, useConnect, useDisconnect } from "wagmi";
import { injected } from "wagmi/connectors";

export default function WalletConnect() {

    const { address, isConnected } = useAccount();
    const { connect } = useConnect();
    const { disconnect } = useDisconnect();

    if(!isConnected){
        return(
            <button onClick={() => connect({ connector: injected() })}>
                connect wallet
            </button>
        );
    }

    return(
        <div>
            <p>Connected: {address}</p>
            <button onClick={disconnect}>Disconnect</button>
        </div>
    )

}
