"use client";

import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { formatEther, parseUnits } from "@ethersproject/units";
import abi from "./abi.json"; // ตรวจให้แน่ใจว่าไฟล์นี้อยู่ในโฟลเดอร์เดียวกัน

const contractAddress = "0x..."; // Smart contract ของคุณ

export default function Page() {
  const [balance, setBalance] = useState("");
  const [isActive, setIsActive] = useState(false); // จำลองการเชื่อมต่อ wallet
  const [accounts, setAccounts] = useState([]);
  const [provider, setProvider] = useState(null);

  useEffect(() => {
    // ตัวอย่างการ set provider จาก window.ethereum
    if (window.ethereum) {
      const newProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(newProvider);

      newProvider.send("eth_requestAccounts", []).then(accs => {
        setAccounts(accs);
        setIsActive(true);
      });
    }
  }, []);

  useEffect(() => {
    const fetchBalance = async () => {
      if (!provider || accounts.length === 0) return;
      const signer = await provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const myBalance = await smartContract.balanceOf(accounts[0]);
      setBalance(formatEther(myBalance));
    };

    if (isActive) fetchBalance();
  }, [isActive, provider, accounts]);

  return (
    <div>
      <h1>My Token Balance</h1>
      <p>Address: {accounts[0]}</p>
      <p>Balance: {balance}</p>
    </div>
  );
}
