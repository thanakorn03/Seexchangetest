"use client";
import React, { useState, useEffect } from "react";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

const [metaMask, hooks] = initializeConnector(
  actions => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActive, useProvider } = hooks;

const contractChain = 11155111; // Sepolia Testnet

// ✅ ให้มี export default แค่ครั้งเดียว
export default function Page() {
  const chainId = useChainId();
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const [error, setError] = useState(undefined);

  useEffect(() => {
    void metaMask.connectEagerly().catch(() => {
      console.debug("Failed to connect eagerly to metamask");
    });
  }, []);

  const handleConnect = () => {
    metaMask.activate(contractChain);
  };

  const handleDisconnect = () => {
    metaMask.resetState();
  };

  return (
    <div>
      <p>chainId: {chainId}</p>
      <p>isActive: {isActive.toString()}</p>
      <p>accounts: {accounts ? accounts[0] : ""}</p>

      {isActive ? (
        <input type="button" onClick={handleDisconnect} value="Disconnect" />
      ) : (
        <input type="button" onClick={handleConnect} value="Connect" />
      )}
    </div>
  );
}
