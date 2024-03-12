require('dotenv').config();
const express = require('express');
const { ethers } = require('ethers');
const axios = require('axios');
const taLib = require('ta-lib');
const ccxt = require('ccxt');
const cron = require('node-cron');
const Chart = require('chart.js');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const provider = new ethers.providers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const exchange = new ccxt.binance({ apiKey: process.env.BINANCE_API_KEY, secret: process.env.BINANCE_SECRET });

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('User connected');
  socket.on('disconnect', () => console.log('User disconnected'));
});

cron.schedule('0 */4 * * *', async () => {
  const marketData = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
  const btcPrice = marketData.data.bitcoin.usd;
  console.log(`Current BTC Price: $${btcPrice}`);

  // Example: Determine if a bear trend is starting and suggest hedging strategies
  // Placeholder for actual trading logic and strategy suggestions
  io.emit('market-update', { btcPrice });
});

server.listen(3000, () => {
  console.log('Bear Guard Finance running on http://localhost:3000');
});