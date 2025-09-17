"use client";

import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Chip,
  Stack,
  Container,
  Card,
  CardContent,
  TextField,
  Box,
  IconButton,
  Divider,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";

import { initializeConnector } from "@web3-react/core";
import { MetaMask } from "@web3-react/metamask";

import { ethers } from "ethers";
import { formatEther, parseUnits } from "@ethersproject/units";
import abi from "./abi.json";

const [metaMask, hooks] = initializeConnector(
  actions => new MetaMask({ actions })
);
const { useAccounts, useIsActive, useProvider } = hooks;

const contractChain = 11155111; // Sepolia Testnet
const contractAddress = "0x157Ee72b81b996766c15e21A820107388B1b04C5";

const getAddressTxt = (str, s = 6, e = 6) => {
  if (str) return `${str.slice(0, s)}...${str.slice(str.length - e)}`;
  return "";
};

export default function Page() {
  const accounts = useAccounts();
  const isActive = useIsActive();
  const provider = useProvider();

  const [balance, setBalance] = useState("");
  const [ETHValue, setETHValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ open: false, message: "", severity: "success" });

  const fetchBalance = async () => {
    if (!provider || !accounts || accounts.length === 0) return;
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const myBalance = await smartContract.balanceOf(accounts[0]);
      setBalance(formatEther(myBalance));
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isActive) fetchBalance();
  }, [isActive, provider, accounts]);

  const handleBuy = async () => {
    if (!ETHValue || ETHValue <= 0) return;
    try {
      setLoading(true);
      const signer = provider.getSigner();
      const smartContract = new ethers.Contract(contractAddress, abi, signer);
      const weiValue = parseUnits(ETHValue.toString(), "ether");
      const tx = await smartContract.buy({ value: weiValue.toString() });
      await tx.wait();
      setNotification({ open: true, message: "Transaction Successful!", severity: "success" });
      setETHValue("");
      fetchBalance(); // refresh balance
    } catch (err) {
      setNotification({ open: true, message: err.message, severity: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = () => metaMask.activate(contractChain);
  const handleDisconnect = () => metaMask.resetState();
  const handleCloseNotification = () => setNotification({ ...notification, open: false });

  return (
    <div>
      {/* Navbar */}
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              UDS DApp
            </Typography>
            {!isActive ? (
              <Button color="inherit" onClick={handleConnect}>
                Connect
              </Button>
            ) : (
              <Stack direction="row" spacing={1}>
                <Chip label={getAddressTxt(accounts[0])} variant="outlined" />
                <Button color="inherit" onClick={handleDisconnect}>
                  Disconnect
                </Button>
              </Stack>
            )}
          </Toolbar>
        </AppBar>
      </Box>

      {/* Card */}
      <Container maxWidth="sm" sx={{ mt: 2 }}>
        {isActive && (
          <Card>
            <CardContent>
              <Stack spacing={2}>
                <Typography variant="h6">UDS</Typography>
                
                {/* Address */}
                <TextField
                  label="Address"
                  value={accounts[0]}
                  InputProps={{ readOnly: true }}
                />

                {/* Balance */}
                <TextField
                  label="UDS Balance"
                  value={balance}
                  InputProps={{ readOnly: true }}
                />

                <Divider />

                {/* Buy ETH */}
                <Typography>Buy UDS (1 ETH = 10 UDS)</Typography>
                <TextField
                  label="ETH"
                  type="number"
                  value={ETHValue}
                  onChange={e => setETHValue(e.target.value)}
                />

                <Button
                  variant="contained"
                  onClick={handleBuy}
                  disabled={loading || !ETHValue || ETHValue <= 0}
                >
                  {loading ? <CircularProgress size={24} /> : "BUY"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        )}
      </Container>

      {/* Notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={5000}
        onClose={handleCloseNotification}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity}>
          {notification.message}
        </Alert>
      </Snackbar>
    </div>
  );
}
