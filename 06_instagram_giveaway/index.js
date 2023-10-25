const fs = require('fs');
const folderPath = './words';

// зчитування текстового файлу і повернення масиву слів.
function readWordsFromFile(filename) {
  const fileContents = fs.readFileSync(`${folderPath}/${filename}`, 'utf-8');
  return fileContents.split('\n').map(line => line.trim());
}

// знаходження унікальних імен користувачів, які зустрічаються хоча б в одному з файлів.
function uniqueValues() {
  const uniqueUsernames = new Set();

  for (let i = 0; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);
    words.forEach(word => uniqueUsernames.add(word));
  }
  return uniqueUsernames.size;
}

// знаходження імен користувачів, які зустрічаються в усіх 20 файлах.
function existInAllFiles() {
  const commonUsernames = new Set();

  // Ініціалізуємо commonUsernames множиною імен з першого файлу
  const wordsInFirstFile = readWordsFromFile('out0.txt');
  wordsInFirstFile.forEach(word => commonUsernames.add(word));

  for (let i = 1; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);

    // Створюємо множину для імен з поточного файлу
    const currentFileUsernames = new Set(words);

    // Використовуємо перетин множин для збереження тільки спільних імен
    commonUsernames.forEach(username => {
      if (!currentFileUsernames.has(username)) {
        commonUsernames.delete(username);
      }
    });
  }

  return commonUsernames.size;
}

// знаходження імен користувачів, які зустрічаються хоча б в 10 файлах.
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

  // Фільтруємо лише імена, які зустрічаються принаймні 10 разів
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
console.log('Elapsed time (uniqueValues):', end - start, 'ms');

const start2 = performance.now();
console.log('Usernames in All Files:', existInAllFiles());
const end2 = performance.now();
console.log('Elapsed time (existInAllFiles):', end2 - start2, 'ms');

const start3 = performance.now();
console.log('Usernames in At Least 10 Files:', existInAtleastTen());
const end3 = performance.now();
console.log('Elapsed time (existInAtleastTen):', end3 - start3, 'ms');
