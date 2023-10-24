const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = 'Токен вашого Telegram-бота';
const ApiKey = 'Токен вашого Api openweathermap.org';
const lat = 50.9216;
const lon = 34.8002;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Weather Forecast Bot.');
  sendCitySelectionKeyboard(chatId);
});

bot.on('message', msg => {
  const chatId = msg.chat.id;
  const message = msg.text;

  switch (message) {
    case 'Forecast in Sumy':
      sendForecastIntervalKeyboard(chatId);
      break;
    case 'Return to the menu':
      sendCitySelectionKeyboard(chatId);
      break;
    case 'Cancel':
      bot.sendMessage(chatId, 'You canceled the operation.');
      break;
    case 'Every 3 hours':
    case 'Every 6 hours':
      const forecastInterval = message === 'Every 3 hours' ? 3 : 6;
      fetchWeatherForecast(chatId, forecastInterval);
      break;
    default:
      // Обробка невідомих повідомлень, якщо потрібно
      break;
  }
});

function sendCitySelectionKeyboard(chatId) {
  const keyboard = {
    reply_markup: {
      keyboard: [[{ text: 'Forecast in Sumy' }], [{ text: 'Cancel' }]],
    },
  };
  bot.sendMessage(chatId, 'Please select a city:', keyboard);
}

function sendForecastIntervalKeyboard(chatId) {
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

function fetchWeatherForecast(chatId, forecastInterval) {
  axios
    .get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}`,
    )
    .then(response => {
      const weatherData = response.data;
      const forecasts = weatherData.list.filter(
        entry => new Date(entry.dt * 1000).getHours() % forecastInterval === 0,
      );
      const forecastMessage = generateForecastMessage(weatherData, forecasts);

      bot.sendMessage(chatId, forecastMessage);
    })
    .catch(error => {
      console.error(error);
      bot.sendMessage(chatId, 'An error occurred while fetching the weather data.');
    });
}

function generateForecastMessage(weatherData, forecasts) {
  let forecastMessage = `Weather forecast for ${weatherData.city.name},  ${weatherData.city.country}:\n`;

  forecasts.forEach(forecast => {
    forecastMessage += `\nDate and Time: ${forecast.dt_txt}\n`;
    forecastMessage += `Temperature: ${forecast.main.temp}°C\n`;
    forecastMessage += `Weather: ${forecast.weather[0].description}\n`;
    forecastMessage += `Wind Speed: ${forecast.wind.speed} m/s\n`;
    forecastMessage += '-------------------\n';
  });

  return forecastMessage;
}
