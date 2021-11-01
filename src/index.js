const { TelegramClient } = require("messaging-api-telegram");
const bitbnsApi = require("bitbns");

const bitbns = new bitbnsApi({
  apiKey: process.env.BIT_BNS_API_KEY,
  apiSecretKey: process.env.BIT_BNS_SECRET_KEY,
});

const client = TelegramClient({
  accessToken: process.env.TELEGRAM_API_KEY,
});

const getLatestPrice = () => {
  bitbns.getTickerApi("BTC,ETH", (error, data) => {
    sendOutMessage(data);
  });
};

const sendOutMessage = (message) => {
   client.sendMessage(1050401913, message);
};

const main = () => {
  getLatestPrice(bitbns);
  sendOutMessage(client);
};

main();
