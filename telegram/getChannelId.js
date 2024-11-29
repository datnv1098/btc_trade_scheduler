require('dotenv').config();
const axios = require('axios');

const telegramToken = process.env.TELEGRAM_TOKEN;

async function getChannelId() {
  try {
    console.log({telegramToken});
    const response = await axios.get(`https://api.telegram.org/bot${telegramToken}/getUpdates`);
    const updates = response.data.result;
    let channelId = 'INITIALIZED';
    for (let update of updates) {
      if (update?.channel_post) {
        console.log('Channel ID:', update?.channel_post?.chat.id);
        channelId = update.channel_post?.chat?.id;
      }
    }
    return channelId;
  } catch (error) {
    console.error('Error getting channel ID:', error);
    return 'Not fond telegram channel Id';
  }
}

module.exports = {
  getChannelId
}