## ERC20 + Express (Viem) — Minimal API

Backend API for an ERC20 contract using Hardhat and Viem.

### Quick start
Two ways to run:

1) Docker Compose (recommended)
```bash
docker compose up --build
```
- Hardhat node on http://localhost:8545
- API on http://localhost:3001 (Swagger: /docs)

2) Manual
```bash
cp .env.example .env
npm install

# Terminal A
npx hardhat node | cat

# Terminal B (after node is running)
npm run deploy:local | cat
npm run start:dev
```

### API endpoints
- GET `/health`
- GET `/api/token`
- GET `/api/balance/:address`
- POST `/api/approve`      body: `{ "spender": "0x..", "amount": "100" }`
- POST `/api/transfer`     body: `{ "to": "0x..", "amount": "1.5" }`
- POST `/api/mint`         body: `{ "to": "0x..", "amount": "1.5" }` (owner-only)
- POST `/api/transferFrom` body: `{ "from": "0x..", "to": "0x..", "amount": "1.5" }`

Swagger UI: `http://localhost:3001/docs`

### Environment
Copy and adjust `.env.example`:
- `PORT` — API port (default 3001)
- `RPC_URL` — Ethereum RPC (default http://127.0.0.1:8545)
- `PRIVATE_KEY` — optional, required for write endpoints (approve/transfer/transferFrom)
MyToken.json` is used

Contract address and ABI are auto-loaded from `deployments/local/MyToken.json` after `npm run deploy:local`.

### Tests
Unit tests cover:
- Token metadata: name, symbol, totalSupply
- Initial supply assigned to owner
- Basic transfers (`transfer`)
- Approval mechanism and `transferFrom` (including allowance decrease to 0)
- Owner-only minting

Run tests:
```bash
npx hardhat test | cat
```

Run a specific test file:
```bash
npx hardhat test test/MyToken.ts | cat
```

Notes:
- No environment variables are required; tests run on Hardhat's in-memory network.
- Ensure dependencies are installed: `npm install`.
