const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const token = '6773544032:AAEC6bQ1FW29-E2S53l3zyMYRhvIcXxgguo';
const ApiKey = '36b87f750cfc980c43d1d775065604a4';
const city = 'Sumy';
const part = 'daily';
const lat = 50.9216;
const lon = 34.8002;

const bot = new TelegramBot(token, { polling: true });
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Weather Forecast Bot!');

  const keyboard = {
    reply_markup: {
      keyboard: [[{ text: 'Forecast in Sumy' }], [{ text: 'Cancel' }]],
    },
  };
  bot.sendMessage(chatId, 'Please select a city:', keyboard);
});

bot.on('message', msg => {
  const chatId = msg.chat.id;
  const message = msg.text;

  if (message === 'Forecast in Sumy') {
    const intervalKeyboard = {
      reply_markup: {
        keyboard: [
          [{ text: 'Every 3 hours' }],
          [{ text: 'Every 6 hours' }],
          [{ text: 'Back to city selection' }],
        ],
      },
    };
    bot.sendMessage(chatId, 'Select the forecast interval:', intervalKeyboard);
  } else if (message === 'Back to city selection') {
    // Go back to the city selection menu
    const keyboard = {
      reply_markup: {
        keyboard: [[{ text: 'Forecast in Sumy' }], [{ text: 'Cancel' }]],
      },
    };
    bot.sendMessage(chatId, 'Please select a city:', keyboard);
  } else if (message === 'Cancel') {
    bot.sendMessage(chatId, 'You canceled the operation.');
  } else if (message === 'Every 3 hours' || message === 'Every 6 hours') {
    const forecastInterval = message === 'Every 3 hours' ? 3 : 6;
    const units = 'metric'; // Використовуємо одиниці вимірювання температури в градусах Цельсія

    axios
      .get(
        //`https://api.openweathermap.org/data/3.0/onecall?lat=${lat}&lon=${lon}&exclude=current&units=${units}&appid=${ApiKey}`,
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${ApiKey}`,
        ///`https://api.openweathermap.org/data/2.5/forecast?lat=50.9216&lon=34.8002&appid=36b87f750cfc980c43d1d775065604a4`,
      )
      .then(response => {
        const weatherData = response.data;

        const forecast = weatherData.list[forecastInterval];
        // Отримання UTC дати та часу з API OpenWeatherMap
        const utcTime = new Date(forecast.dt_txt + ' UTC');

        // Функція для конвертації UTC часу в локальний час
        const convertUtcToLocal = utcTime => {
          const offset = new Date().getTimezoneOffset();
          const localTime = new Date(utcTime.getTime() - offset * 60000);
          console.log(localTime);
          return localTime;
        };

        const localTime = convertUtcToLocal(utcTime);

        // Формування форматованої дати та часу
        const localDate = localTime.toISOString().slice(0, 10);
        const localTimeFormatted = localTime.toTimeString().slice(0, 8);

        const forecastMessage =
          `Weather Forecast for Sumy:\n` +
          `Date: ${localDate}\n` +
          `Time: ${localTimeFormatted}\n` +
          `Temperature: ${forecast.main.temp}°C\n` +
          `Weather: ${forecast.weather[0].description}\n` +
          `Humidity: ${forecast.main.humidity}%\n` +
          `Pressure: ${forecast.main.pressure} hPa\n` +
          `Wind Speed: ${forecast.wind.speed} m/s\n` +
          `Cloudiness: ${forecast.clouds.all}%\n` +
          `Visibility: ${forecast.visibility} meters\n` +
          `Rain Volume (3h): ${forecast.rain ? forecast.rain['3h'] : 0} mm\n` +
          `Snow Volume (3h): ${forecast.snow ? forecast.snow['3h'] : 0} mm\n`;

        bot.sendMessage(chatId, forecastMessage);
      })
      .catch(error => {
        console.error('Помилка при отриманні погодних даних:', error); // Додаємо вивід помилки в консоль
        bot.sendMessage(chatId, 'An error occurred while fetching the weather data.');
      });
  }
});
