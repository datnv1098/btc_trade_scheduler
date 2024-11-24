require('dotenv').config();
const axios = require('axios');

const telegramToken = process.env.TELEGRAM_TOKEN;
async function getChannelId() {
    try {
        console.log({telegramToken});
        const response = await axios.get(`https://api.telegram.org/bot${telegramToken}/getUpdates`);
        console.log("response?.data", JSON.stringify(response?.data));
        const updates = response.data.result;
        // Find the channel post message
        for (let update of updates) {
            if (update?.channel_post) {
                console.log('Channel ID:', update?.channel_post?.chat.id);
                return update.channel_post?.chat?.id;
            }
        }
    } catch (error) {
        console.error('Error getting channel ID:', error);
    }
}

module.exports = {
    getChannelId
}