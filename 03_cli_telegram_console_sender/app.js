const TelegramBot = require('node-telegram-bot-api');
const { program } = require('commander');

const token = 'Токен вашого Telegram-бота';

const bot = new TelegramBot(token, { polling: true });

//  команда /start
// Отримання ідентифікатора чату користувача
bot.onText(/\/start/, msg => {
  const chatId = msg.chat.id;
  // Визначення програми з використанням Commander
  program
    .name('node app.js')
    .description('Telegram Console Sender')
    .version('1.0.0')
    .usage('<command>');

  //'send-message' command
  program
    .command('send-message <message>')
    .description('Send a message to your Telegram bot')
    .action(message => {
      bot.sendMessage(chatId, message).then(() => process.exit(0));
    });

  //'send-photo' command
  program
    .command('send-photo <path>')
    .description('Send a photo to your Telegram bot')
    .action(path => {
      bot.sendPhoto(chatId, path).then(() => process.exit(0));
    });

  //help command
  program
    .command('help')
    .description('Display help for available commands')
    .action(() => {
      program.help();
    });

  // Розбір аргументів командного рядка
  program.parse(process.argv);
});
