"use client";

import React, { useState, useEffect } from "react";
import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

const [metaMask, hooks] = initializeConnector(
  actions => new MetaMask({ actions })
);
const { useChainId, useAccounts, useIsActive, useProvider } = hooks;

const contractChain = 11155111; // Sepolia Testnet

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
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

export default function NavBar() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            My DApp
          </Typography>
          <Button color="inherit">Connect Wallet</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
