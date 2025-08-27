#!/usr/bin/env bash
set -euo pipefail

# Wait for Hardhat RPC to become available
RPC_URL="${RPC_URL:-http://hardhat:8545}"
echo "Waiting for RPC at ${RPC_URL}..."
until node -e "const http=require('http');const u=new URL(process.env.RPC_URL||'http://hardhat:8545');const req=http.request({hostname:u.hostname,port:u.port,path:'/'},res=>process.exit(0));req.on('error',()=>process.exit(1));req.end();"; do
  sleep 1
done

# Deploy the contract (Hardhat will compile if needed)
npm run deploy:local

# Start the application
node --enable-source-maps dist/server.js


