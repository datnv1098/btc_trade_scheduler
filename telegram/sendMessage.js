require('dotenv').config();
const axios = require('axios');

const telegramChatId = process.env.TELEGRAM_CHAT_ID;
const telegramToken = process.env.TELEGRAM_TOKEN;

function getMessageData(data = {}, isBuy = false) {
    let text = isBuy ? `MUA ${data?.symbol || ''}\n ` : `BÁN ${data?.symbol || ''}\n`;
    if (data?.quantity) text += `Số Lượng: ${data?.quantity || ''} \n`;
    if (data?.price) text += `Giá: ${data?.price || ''} \n`;
    if (data?.amount) text += `USDT: ${data?.amount || ''}USDT \n`;
    if (data?.message) text += `ERROR Message: ${data?.message || ''} \n`;
    return text;
}

/**
 * sendTelegramMessage
 * @param message
 * @returns {Promise<void>}
 */
async function sendTelegramMessage(message) {
    try {
        let removeSomeChar = message?.replaceAll('.', ',');
        removeSomeChar = removeSomeChar?.replaceAll('{', ' ');
        removeSomeChar = removeSomeChar?.replaceAll('}', ' ');
        removeSomeChar = removeSomeChar?.replaceAll('-', ' ');
        await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: telegramChatId,
            text: removeSomeChar,
            parse_mode: 'MarkdownV2'
        });
    } catch (error) {
        console.log(error);
        await axios.post(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
            chat_id: telegramChatId,
            text: 'Error sending message to the Telegram bot',
            parse_mode: 'MarkdownV2'
        });
    }
}

module.exports = {
    getMessageData,
    sendTelegramMessage,
};