require('dotenv').config();
const https = require('https');
const crypto = require('crypto');
const schedule = require('node-schedule');
const axios = require("axios");
const moment = require("moment");

const API_KEY = process.env.API_KEY;
const API_SECRET = process.env.API_SECRET;
const BASE_URL = 'https://api.binance.com';

// Thời gian lấy giá (10 phút trước)
const INTERVAL = '1m'; // Đơn vị: 1 phút
const LOOKBACK_MINUTES = 10;
const AMOUNT_USDT = process.env.AMOUNT_USDT || 30;

// Hàm tạo chữ ký
function createSignature(queryString) {
  return crypto.createHmac('sha256', API_SECRET).update(queryString).digest('hex');
}

// Hàm gửi request
function sendRequest(method, path, data, callback) {
  const timestamp = Date.now();
  const queryString = new URLSearchParams({...data, timestamp}).toString();
  const signature = createSignature(queryString);
  const fullPath = `${path}?${queryString}&signature=${signature}`;

  const options = {
    hostname: 'api.binance.com',
    port: 443,
    path: fullPath,
    method: method,
    headers: {
      'X-MBX-APIKEY': API_KEY,
    },
  };

  const req = https.request(options, res => {
    let responseData = '';
    res.on('data', chunk => (responseData += chunk));
    res.on('end', () => callback(null, JSON.parse(responseData)));
  });

  req.on('error', error => callback(error));
  req.end();
}

// Hàm lấy giá Klines
function getKlines(symbol, callback) {
  const endTime = Date.now(); // Thời điểm kết thúc (10 phút trước)
  const startTime = endTime - LOOKBACK_MINUTES * 60 * 1000; // Thời điểm bắt đầu (20 phút trước)

  try {
    const params = {
      symbol,       // Cặp giao dịch, ví dụ: BTCUSDT
      interval: INTERVAL,     // Khoảng thời gian nến, ví dụ: 1m, 5m
      startTime,    // Timestamp thời điểm bắt đầu (ms)
      endTime,      // Timestamp thời điểm kết thúc (ms)
      limit: 10,        // Số lượng nến cần lấy
    };
    axios.get(`${BASE_URL}/api/v3/klines`, {params})
      .then(response => {
        const data = response.data;
        // Parse dữ liệu để tìm giá cao nhất và thấp nhất
        const highPrices = data.map(candle => parseFloat(candle[2])); // Giá cao
        const lowPrices = data.map(candle => parseFloat(candle[3])); // Giá thấp
        const high = Math.max(...highPrices); // Giá cao nhất
        const low = Math.min(...lowPrices); // Giá thấp nhất
        console.log({high, low});
        if (!high || !low) return callback(null, false);
        callback(null, {high, low});
      });
  } catch (error) {
    console.error('Error fetching klines:', error.response?.data || error.message);
  }
}

// Đặt lệnh mua với giá thấp nhất
function buyAtLowestPrice() {
  getKlines('BTCUSDT', (err, prices) => {
    if (err) return console.error('Lỗi khi lấy dữ liệu giá:', err);

    console.log(`Giá thấp nhất để mua: ${prices.low}`);
    console.log(`Quantity: ${(AMOUNT_USDT / prices.low).toFixed(6)}`);
    console.log(`Price: ${prices?.low?.toFixed(2)}`);

    sendRequest(
      'POST',
      '/api/v3/order',
      {
        symbol: 'BTCUSDT',
        side: 'BUY',
        type: 'LIMIT',
        timeInForce: 'GTC',
        quantity: (AMOUNT_USDT / prices.low).toFixed(5),
        price: prices?.low?.toFixed(2),
      },
      (err, response) => {
        if (err) return console.error('Lỗi khi đặt lệnh mua:', err);
        console.log('Đặt lệnh mua thành công:', response);
      }
    );
  });
}

// Đặt lệnh bán với giá cao nhất
function sellAtHighestPrice() {
  getKlines('BTCUSDT', (err, prices) => {
    if (err) return console.error('Lỗi khi lấy dữ liệu giá:', err);

    console.log(`Giá cao nhất để bán: ${prices.high}`);

    // Lấy số dư BTC hiện tại
    sendRequest('GET', '/api/v3/account', {}, (err, data) => {
      if (err) return console.error('Lỗi khi lấy thông tin tài khoản:', err);
      const btcBalance = parseFloat(
        data.balances.find(asset => asset.asset === 'BTC').free
      );
      console.log({btcBalance});
      if (btcBalance > 0) {
        sendRequest(
          'POST',
          '/api/v3/order',
          {
            symbol: 'BTCUSDT',
            side: 'SELL',
            type: 'LIMIT',
            timeInForce: 'GTC',
            quantity: btcBalance.toFixed(4),
            price: prices.high.toFixed(2),
          },
          (err, response) => {
            if (err) return console.error('Lỗi khi đặt lệnh bán:', err);
            console.log('Đặt lệnh bán thành công:', response);
          }
        );
      } else {
        console.log('Không có BTC để bán.');
      }
    });
  });
}


function BTCSchedulerCronJob() {
  const currentDate = new Date();
  const isUTC = currentDate.getHours() === currentDate.getUTCHours();
  console.log("isUTC: ", isUTC);
  let cronJobStrLogTime = '*/5 * * * *';
  schedule.scheduleJob(cronJobStrLogTime, function () {
    console.log('Current time:', moment().format('YYYY-MM-DD HH:mm:ss'));
  });

  let cronJobStrBUY = isUTC ? '0 22 * * *' : '0 5 * * *';
  // Lịch mua BTC lúc 5h sáng VN Time
  schedule.scheduleJob(cronJobStrBUY, () => {
    console.log('Mua BTC dựa trên giá thấp nhất trước 5h sáng...', API_KEY);
    buyAtLowestPrice();
  });
  let cronJobStrSELL = isUTC ? '0 3 * * *' : '0 10 * * *';
  // // Lịch bán BTC lúc 10h sáng VN Time
  schedule.scheduleJob(cronJobStrSELL, () => {
    console.log('Bán BTC dựa trên giá cao nhất trước 10h sáng...');
    sellAtHighestPrice();
  });
}

module.exports = {
  BTCSchedulerCronJob
};