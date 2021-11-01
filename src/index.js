const { TelegramClient } = require("messaging-api-telegram");
const bitbnsApi = require("bitbns");

const bitbns = new bitbnsApi({
  apiKey: process.env.BIT_BNS_API_KEY,
  apiSecretKey: process.env.BIT_BNS_SECRET_KEY,
});

const client = new TelegramClient({
  accessToken: process.env.TELEGRAM_API_KEY,
});

const escapeStr = (str) => {
  return str
    .replace(/_/gi, "\\_")
    .replace(/-/gi, "\\-")
    .replace("~", "\\~")
    .replace(/`/gi, "\\`")
    .replace(/\./g, "\\.")
    .replace(/\</g, "\\<")
    .replace(/\>/g, "\\>");
};

const getTopPerformers = (cryptoListObject) => {
  const cryptos = Object.keys(cryptoListObject);
  return cryptos
    .reduce((acc, ce) => {
      const currentValue = cryptoListObject[ce]["last_traded_price"];
      const yesterdayVal = cryptoListObject[ce]["yes_price"];
      const valueChange = (1 - yesterdayVal / currentValue) * 100;
      acc.push({
        coin: ce,
        valueChange,
        displayValue: `*${ce}:* ${valueChange.toFixed(3)}%`,
      });
      return acc;
    }, [])
    .sort((a, b) => b.valueChange - a.valueChange);
};

const getLatestPrice = () => {
  bitbns.fetchTickers((error, data) => {
    const performers = getTopPerformers(data);
    sendOutMessage(
      performers
        .map((item) => escapeStr(item.displayValue))
        .slice(0, 50)
        .join(" <br />")
    );
  });
};

const sendOutMessage = (message) => {
  client.sendMessage(1050401913, message, { parseMode: "MarkdownV2" });
};

const main = () => {
  getLatestPrice(bitbns);
};

main();
