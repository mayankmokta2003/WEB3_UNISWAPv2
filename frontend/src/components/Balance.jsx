import { useReadContract, useAccount } from "wagmi";
import erc20Abi from "../abi/ERC20.json";
import factoryAbi from "../abi/UniswapV2Factory.json";
import {
  TOKEN0_ADDRESS,
  TOKEN1_ADDRESS,
  FACTORY_ADDRESS,
} from "../config/addresses";

export default function Balance() {
  const { address } = useAccount();

  const { data: pairAddress } = useReadContract({
    address: FACTORY_ADDRESS,
    abi: factoryAbi,
    functionName: "getPair",
    args: [TOKEN0_ADDRESS, TOKEN1_ADDRESS],
  });

  const { data: RealBalance } = useReadContract({
    address: TOKEN0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [pairAddress],
  });

  const { data: userBalance } = useReadContract({
    address: TOKEN0_ADDRESS,
    abi: erc20Abi,
    functionName: "balanceOf",
    args: [address],
  });

  return (
    <div>
      <h1>helooooo</h1>

      <p>REAL BALANCE: {RealBalance}</p>
      <p>USER BALANCE: {userBalance}</p>
    </div>
  );
}
