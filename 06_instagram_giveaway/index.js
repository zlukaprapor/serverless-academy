const fs = require('fs');
const folderPath = './words';

// зчитування текстового файлу і повернення масиву слів.
function readWordsFromFile(filename) {
  const fileContents = fs.readFileSync(`${folderPath}/${filename}`, 'utf-8');
  return fileContents.split('\n').map(line => line.trim());
}

// знаходження унікальних імен користувачів, які зустрічаються хоча б в одному з файлів.
//використовуються алгоритми пошук унікальних значень
function uniqueValues() {
  const uniqueUsernames = new Set();

  for (let i = 0; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);
    words.forEach(word => uniqueUsernames.add(word));
  }
  return uniqueUsernames.size;
}

// знаходження імен користувачів, які зустрічаються в усіх 20 файлах.
// використовуються алгоритми об'єднання та перетин множин
function existInAllFiles() {
  const commonUsernames = new Set();

  const wordsInFirstFile = readWordsFromFile('out0.txt');
  wordsInFirstFile.forEach(word => commonUsernames.add(word));

  for (let i = 1; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);

    const currentFileUsernames = new Set(words);

    commonUsernames.forEach(username => {
      if (!currentFileUsernames.has(username)) {
        commonUsernames.delete(username);
      }
    });
  }

  return commonUsernames.size;
}

// знаходження імен користувачів, які зустрічаються хоча б в 10 файлах.
// використовуються алгоритми пошуку
function existInAtleastTen() {
  const usernameCountMap = new Map();

  for (let i = 0; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);

    words.forEach(word => {
      if (!usernameCountMap.has(word)) {
        usernameCountMap.set(word, 1);
      } else {
        usernameCountMap.set(word, usernameCountMap.get(word) + 1);
      }
    });
  }

  let countAtLeastTen = 0;
  for (const count of usernameCountMap.values()) {
    if (count >= 10) {
      countAtLeastTen++;
    }
  }

  return countAtLeastTen;
}

// Вимірюємо продуктивність кожної функції.
const start = performance.now();
console.log('Unique Usernames:', uniqueValues());
const end = performance.now();
const elapsedMilliseconds1 = end - start;
const elapsedMinutes1 = Math.floor(elapsedMilliseconds1 / 60000); // Визначаємо кількість хвилин
const remainingSeconds1 = (elapsedMilliseconds1 % 60000) / 1000; // Визначаємо кількість секунд
const elapsedMillisecondsFormatted1 = (elapsedMilliseconds1 % 1000).toFixed(0); // Визначаємо мілісекунди
console.log(
  'Elapsed time (uniqueValues):',
  elapsedMinutes1,
  'minute',
  Math.floor(remainingSeconds1),
  'second',
  elapsedMillisecondsFormatted1,
  'millisecond',
);

const start2 = performance.now();
console.log('Usernames in All Files:', existInAllFiles());
const end2 = performance.now();
const elapsedMilliseconds2 = end2 - start2;
const elapsedMinutes2 = Math.floor(elapsedMilliseconds2 / 60000);
const remainingSeconds2 = (elapsedMilliseconds2 % 60000) / 1000;
const elapsedMillisecondsFormatted2 = (elapsedMilliseconds2 % 1000).toFixed(0);
console.log(
  'Elapsed time (existInAllFiles):',
  elapsedMinutes2,
  'minute',
  Math.floor(remainingSeconds2),
  'second',
  elapsedMillisecondsFormatted2,
  'millisecond',
);

const start3 = performance.now();
console.log('Usernames in At Least 10 Files:', existInAtleastTen());
const end3 = performance.now();
const elapsedMilliseconds3 = end3 - start3;
const elapsedMinutes3 = Math.floor(elapsedMilliseconds3 / 60000);
const remainingSeconds3 = (elapsedMilliseconds3 % 60000) / 1000;
const elapsedMillisecondsFormatted3 = (elapsedMilliseconds3 % 1000).toFixed(0);
console.log(
  'Elapsed time (existInAtleastTen):',
  elapsedMinutes3,
  'minute',
  Math.floor(remainingSeconds3),
  'second',
  elapsedMillisecondsFormatted3,
  'millisecond',
);
