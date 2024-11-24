require('dotenv').config();
const moment = require("moment");
const {BTCSchedulerCronJob} = require("./btc_trade_scheduler.js");
const {ETHSchedulerCronJob} = require("./eth_trade_scheduler");
const {getChannelId} = require("./telegram/getChannelId");

function runMain() {
  const systemTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  console.log('System Time Zone:', systemTimeZone);
  console.log("Main Start Time: ", moment().format('YYYY-MM-DD HH:mm:ss'));
  getChannelId().then()
  // BTCSchedulerCronJob();
  ETHSchedulerCronJob();
}

runMain();