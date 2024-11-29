require('dotenv').config();
const moment = require("moment");
const {getChannelId} = require("./telegram/getChannelId");
const {sendTelegramMessage} = require("./telegram/sendMessage");
const {BTCSchedulerCronJob} = require("./trades/btc_trade_scheduler.js");
const {ETHSchedulerCronJob} = require("./trades/eth_trade_scheduler");
const {UNISchedulerCronJob} = require("./trades/uni_trade_scheduler");
const {SOLSchedulerCronJob} = require("./trades/sol_trade_scheduler");
const {BONKSchedulerCronJob} = require("./trades/bonk_trade_scheduler");
const {BNBSchedulerCronJob} = require("./trades/bnb_trade_scheduler");

function runMain() {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log("Main Start Time: ", moment().format('YYYY-MM-DD HH:mm:ss'));
  getChannelId().then()
  // sendTelegramMessage(`Start server\nSystem TimeZone: ${systemTimeZone}\n${moment().format('DD/MM/YYYY HH:mm:ss')}`).then()

  BTCSchedulerCronJob(); //50 USDT
  ETHSchedulerCronJob(); //50 USDT
  SOLSchedulerCronJob(); //50 USDT
  BNBSchedulerCronJob(); //50 USDT

  BONKSchedulerCronJob(); // 15 USDT
  UNISchedulerCronJob(); // 15 USDT

  //MIN USDT FOR RUN: 230 USDT
}

runMain();