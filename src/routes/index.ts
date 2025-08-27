import express from "express";
import type { Request, Response } from "express";
import { getTokenInfo, getBalance, approveSpender, transferFrom, transfer, mint } from "../services/service";

const api = express.Router();

// Token info
api.get("/token", async (_req: Request, res: Response) => {
  try {
    const info = await getTokenInfo();
    res.json(info);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
});

// Balance
api.get("/balance/:address", async (req: Request, res: Response) => {
  try {
    const { address } = req.params;
    const bal = await getBalance(address);
    res.json(bal);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Approve
api.post("/approve", async (req: Request, res: Response) => {
  try {
    const { spender, amount } = req.body ?? {};
    const result = await approveSpender(spender, amount);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Transfer From
api.post("/transferFrom", async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body ?? {};
    const result = await transferFrom(from, to, amount);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Transfer
api.post("/transfer", async (req: Request, res: Response) => {
  try {
    const { to, amount } = req.body ?? {};
    const result = await transfer(to, amount);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

// Mint
api.post("/mint", async (req: Request, res: Response) => {
  try {
    const { to, amount } = req.body ?? {};
    const result = await mint(to, amount);
    res.json(result);
  } catch (e: any) {
    res.status(400).json({ error: e.message });
  }
});

export default api;


