const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

//const token = 'Токен вашого Telegram-бота';
//const ApiKey = 'Токен вашого Api openweathermap.org';
const lat = 50.9216;
const lon = 34.8002;

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, startHandler);
bot.on('message', messageHandler);

function startHandler(msg) {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Weather Forecast and Exchange Rate Bot!');
  sendMainMenu(chatId);
}

function messageHandler(msg) {
  const chatId = msg.chat.id;
  const message = msg.text;

  switch (message) {
    case 'Exchange Rate':
      sendExchangeRateMenu(chatId);
      break;
    case 'USD Exchange Rate':
    case 'EUR Exchange Rate':
      fetchExchangeRate(chatId, message);
      break;
    case 'Forecast in Sumy':
      sendForecastIntervalMenu(chatId);
      break;
    case 'Return to the menu':
      sendMainMenu(chatId);
      break;
    case 'Cancel':
      bot.sendMessage(chatId, 'You canceled the operation.');
      break;
    case 'Every 3 hours':
    case 'Every 6 hours':
      fetchWeatherForecast(chatId, message);
      break;
    default:
      bot.sendMessage(chatId, 'I do not understand your message.');
  }
}

function sendMainMenu(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [[{ text: 'Forecast in Sumy' }, { text: 'Exchange Rate' }], [{ text: 'Cancel' }]],
    },
  };
  bot.sendMessage(chatId, 'Please select what do you want?', keyboard);
}

function sendExchangeRateMenu(chatId) {
  const exchangeRateKeyboard = {
    reply_markup: {
      keyboard: [
        [{ text: 'USD Exchange Rate' }, { text: 'EUR Exchange Rate' }],
        [{ text: 'Return to the menu' }],
      ],
    },
  };
  bot.sendMessage(chatId, 'Select the exchange rate:', exchangeRateKeyboard);
}

function sendForecastIntervalMenu(chatId) {
  const intervalKeyboard = {
    reply_markup: {
      keyboard: [
        [{ text: 'Every 3 hours' }, { text: 'Every 6 hours' }],
        [{ text: 'Return to the menu' }],
      ],
    },
  };
  bot.sendMessage(chatId, 'Select the forecast interval:', intervalKeyboard);
}

function fetchExchangeRate(chatId, currency) {
  let apiUrl = '';
  if (currency === 'USD Exchange Rate') {
    apiUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5';
  } else if (currency === 'EUR Exchange Rate') {
    apiUrl = 'https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=11';
  }

  axios
    .get(apiUrl)
    .then(response => {
      const exchangeRate = currency === 'USD Exchange Rate' ? response.data[0] : response.data[0];
      bot.sendMessage(
        chatId,
        `Current exchange rate for ${currency}:\n\nBuy: ${exchangeRate.buy}\nSale: ${exchangeRate.sale}`,
      );
    })
    .catch(error => {
      console.error(error);
      bot.sendMessage(chatId, 'An error occurred while fetching the exchange rate.');
    });
}

function fetchWeatherForecast(chatId, message) {
  const forecastInterval = message === 'Every 3 hours' ? 3 : 6;

  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}`,
    )
    .then(response => {
      const weatherData = response.data;
      const forecasts = weatherData.list.filter(
        entry => new Date(entry.dt * 1000).getHours() % forecastInterval === 0,
      );
      let forecastMessage = `Weather forecast for ${weatherData.city.name}, ${weatherData.city.country}:\n`;

      forecasts.forEach(forecast => {
        forecastMessage += `\nDate and Time: ${forecast.dt_txt}\n`;
        forecastMessage += `Temperature: ${forecast.main.temp}°C\n`;
        forecastMessage += `Weather: ${forecast.weather[0].description}\n`;
        forecastMessage += `Wind Speed: ${forecast.wind.speed} m/s\n`;
        forecastMessage += '-------------------\n';
      });

      bot.sendMessage(chatId, forecastMessage);
    })
    .catch(error => {
      console.error(error);
      bot.sendMessage(chatId, 'An error occurred while fetching the weather data.');
    });
}
