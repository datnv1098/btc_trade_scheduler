require('dotenv').config();
const moment = require("moment");
const {BTCSchedulerCronJob} = require("./btc_trade_scheduler.js");
const {ETHSchedulerCronJob} = require("./eth_trade_scheduler");
const {getChannelId} = require("./telegram/getChannelId");
const {sendTelegramMessage} = require("./telegram/sendMessage");

function runMain() {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Main Start Time: ", moment().format('YYYY-MM-DD HH:mm:ss'));
  getChannelId().then()
  sendTelegramMessage(`Start server\nSystem TimeZone: ${systemTimeZone}\n${moment().format('DD/MM/YYYY HH:mm:ss')}`).then()
  BTCSchedulerCronJob();
  ETHSchedulerCronJob();
}

runMain();