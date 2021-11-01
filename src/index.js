const { TelegramClient } = require("messaging-api-telegram");
const bitbnsApi = require("bitbns");
const _ = require("lodash");

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
    .replace(/=/g, "\\=")
    .replace(/\>/g, "\\>");
};

const getTopPerformers = (cryptoListObject) => {
  const cryptos = Object.keys(cryptoListObject);
  const performers = cryptos.reduce((acc, ce) => {
    if (_.isEmpty(cryptoListObject[ce]["volume"])) {
      return acc;
    }

    const currentValue = cryptoListObject[ce]["last_traded_price"];
    const yesterdayVal = cryptoListObject[ce]["yes_price"];
    const valueChange = (1 - yesterdayVal / currentValue) * 100;
    acc.push({
      coin: ce,
      valueChange,
      displayValue: `*${ce}:* ${valueChange.toFixed(3)}%`,
    });
    return acc;
  }, []);
  return _.orderBy(performers, ["valueChange"], ["desc"]);
};

const getLatestPrice = () => {
  bitbns.fetchTickers((error, data) => {
    const performers = getTopPerformers(data);
    sendOutMessage(`
    \n
      ${performers
        .map((item) => escapeStr(item.displayValue))
        .slice(0, 40)
        .join(" \n")}
    \n`);
  });
};

const sendOutMessage = (message) => {
  client.sendMessage(1050401913, message, { parseMode: "MarkdownV2" });
};

const main = () => {
  getLatestPrice(bitbns);
};

main();
