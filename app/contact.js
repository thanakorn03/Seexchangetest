import abi from "./abi.json";
import { ethers } from "ethers";
import { formatEther, parseUnits } from "@ethersproject/units";

const contractAddress = "0x..."; // Smart contract ของคุณ

useEffect(() => {
  const fetchBalance = async () => {
    const signer = provider.getSigner();
    const smartContract = new ethers.Contract(contractAddress, abi, signer);
    const myBalance = await smartContract.balanceOf(accounts[0]);
    setBalance(formatEther(myBalance));
  };

  if (isActive) fetchBalance();
}, [isActive]);
