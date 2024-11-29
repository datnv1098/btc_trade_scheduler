require('dotenv').config();
const moment = require("moment");
const {getChannelId} = require("./telegram/getChannelId");
const {sendTelegramMessage} = require("./telegram/sendMessage");
const {BTCSchedulerCronJob} = require("./trades/btc_trade_scheduler.js");
const {ETHSchedulerCronJob} = require("./trades/eth_trade_scheduler");
const {UNISchedulerCronJob} = require("./trades/uni_trade_scheduler");
const {SOLSchedulerCronJob} = require("./trades/sol_trade_scheduler");

function runMain() {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Main Start Time: ", moment().format('YYYY-MM-DD HH:mm:ss'));
  getChannelId().then()
  sendTelegramMessage(`Start server\nSystem TimeZone: ${systemTimeZone}\n${moment().format('DD/MM/YYYY HH:mm:ss')}`).then()
  BTCSchedulerCronJob();
  ETHSchedulerCronJob();
  UNISchedulerCronJob();
  SOLSchedulerCronJob();
}

runMain();