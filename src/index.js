const { TelegramClient } = require("messaging-api-telegram");
const bitbnsApi = require("bitbns");

const bitbns = new bitbnsApi({
  apiKey: process.env.BIT_BNS_API_KEY,
  apiSecretKey: process.env.BIT_BNS_SECRET_KEY,
});

const client = new TelegramClient({
  accessToken: process.env.TELEGRAM_API_KEY,
});

const getTopPerformers = (cryptoListObject) => {
  const cryptos = Object.keys(cryptoListObject);
  return cryptos
    .reduce((acc, ce) => {
      const currentValue = cryptoListObject[ce]["last_traded_price"];
      const yesterdayVal = cryptoListObject[ce]["yes_price"];
      const changeValue = (1 - yesterdayVal / currentValue) * 100;
      acc.push({
        coin: ce,
        valueChange: changeValue,
        displayValue: `<strong>${ce}:</strong><i>${changeValue}%</i>`,
      });
      return acc;
    }, [])
    .sort((a, b) => a - b);
};

const getLatestPrice = () => {
  bitbns.fetchTickers((error, data) => {
    const performers = getTopPerformers(data);
    sendOutMessage(performers.map((item) => item.displayValue).slice(0, 20));
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
