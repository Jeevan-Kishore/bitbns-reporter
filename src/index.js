const { TelegramClient } = require('messaging-api-telegram');
const bitbnsApi = require('bitbns');

const initiateBNS = () => {
    return new bitbnsApi({
        apiKey: process.env.BIT_BNS_API_KEY,
        apiSecretKey: process.env.BIT_BNS_SECRET_KEY
    });
}

const initiateTelegramClient = () => {
    return new TelegramClient({
        accessToken: process.env.TELEGRAM_API_KEY,
    });
}

const getLatestPrice = (bitbns) => {
    bitbns.getTickerApi('BTC,ETH',(error,data) => {
        console.log("BTC Price :: ",data);
    })
}

const sendOutMessage = async (client) => {
    await client.sendMessage(1050401913, `Hello World @ ${new Date()}`);
    console.log('<-- sent message -->');
}

const main = () => {
    const bitbns = initiateBNS();
    const client = initiateTelegramClient();
    getLatestPrice(bitbns);
    sendOutMessage(client);
}


main();
