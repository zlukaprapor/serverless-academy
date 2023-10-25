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

  for (let i = 0; i < 20; i++) {
    const words = readWordsFromFile(`out${i}.txt`);

    // On the first file, add all words to the commonUsernames set.
    if (i === 0) {
      words.forEach(word => commonUsernames.add(word));
    } else {
      // For subsequent files, retain only the usernames that exist in the current file.
      commonUsernames.forEach(username => {
        if (!words.includes(username)) {
          commonUsernames.delete(username);
        }
      });
    }
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

  const usernamesAtLeastTen = Array.from(usernameCountMap).filter(
    ([username, count]) => count >= 10,
  );

  return usernamesAtLeastTen.length;
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
