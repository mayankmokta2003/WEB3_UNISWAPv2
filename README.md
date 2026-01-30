# 🦄 Uniswap V2 Clone – Full Stack Web3 Project

This repository contains a full-stack Uniswap V2–style decentralized exchange built from scratch for learning and demonstration purposes.

The project focuses on understanding how AMMs work internally, how liquidity pools are managed, and how real-world Web3 applications use a backend indexer alongside smart contracts.

---

## 📌 Features

- Add liquidity to token pairs
- Remove liquidity using LP tokens
- Swap ERC20 tokens using AMM logic
- Automatic LP token minting and burning
- Backend indexing of pool data
- REST APIs for frontend consumption

---

## 🏗 Project Architecture

Frontend → Smart Contracts → Backend Indexer → Database

- Frontend interacts directly with smart contracts using MetaMask
- Backend listens to blockchain events and stores data
- Backend exposes read-only APIs
- Backend never controls user funds

---

## 🧠 Tech Stack

### Smart Contracts
- Solidity
- Foundry
- Custom Uniswap V2 logic (Factory, Pair, Router)

### Frontend
- React
- Wagmi
- Viem
- MetaMask
- Tailwind CSS

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Viem (event listeners)

### Deployment
- Frontend: Vercel
- Backend: Railway
- Database: Railway MongoDB

---

## 📁 Folder Structure



---

## 🔗 Smart Contracts Overview

### Factory
- Creates token pairs
- Ensures unique pair per token combination

### Pair
- Holds token reserves
- Mints LP tokens
- Burns LP tokens
- Maintains constant product invariant

### Router
- addLiquidity
- removeLiquidity
- swapExactTokensForTokens

---

## 🗄 Backend Role

The backend acts as an off-chain indexer.

It listens to on-chain events:
- PairCreated
- Sync
- Swap

Stored data:
- Pair address
- Token addresses
- Reserves
- Swap volume

Backend is read-only and never signs transactions.

---

## 🌐 Backend APIs



Used by frontend to display pool and reserve data.

---

## 🚀 Deployment Steps

1. Push code to GitHub
2. Deploy backend on Railway
   - Set root directory to `/backend`
   - Add MongoDB plugin
   - Set `MONGO_URI` environment variable
3. Copy Railway backend URL
4. Use backend URL in frontend API calls
5. Deploy frontend on Vercel

---

## ⚠️ Known Limitations

- Contract redeployment requires backend database reset
- No price oracle
- Simplified fee logic
- Designed for learning, not production use

---

## 🎯 Purpose

This project demonstrates:
- Deep understanding of Uniswap V2 mechanics
- Full-stack Web3 development
- Event-based backend indexing
- Real deployment workflow

---

## 👤 Author

Mayank Mokta  
Blockchain / Web3 Developer
