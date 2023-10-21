/*
test word -- cherry 9 raspberry 17 23 11 56 strawberry 2 34 6 lemon 45 85 8 quince 12 tangerine 78 4 67 orange grape honeydew date 90 62 33 apple kiwi fox 27 strawberry 85
             -123 45.67 -0.5 0 123  A1 b2 C3 d4 E5 f6 G7 h8 I9 j0 + - ?

*/
const readlineConsole = require('readline');

// інтерфейс для зчитування та виведення інформації
const cli = readlineConsole.createInterface({
  input: process.stdin,
  output: process.stdout,
});

let values = [];

//отримання введення від користувача
const getUserInput = () => {
  cli.question(
    'Enter a few words or numbers separated by a space (or type "exit" to quit): ',
    input => {
      if (input.toLowerCase() === 'exit') {
        cli.close();
      } else {
        values = processInput(input);
        showOperationMenu();
      }
    },
  );
};
//обробка введеного тексту
const processInput = input => {
  return input.split(' ').map(value => {
    if (typeof value === 'string' && /^-?\d*\.?\d+$/.test(value)) {
      //  memo((  ^: Початок рядка.-?: Нуль або один знак мінус перед числом.\d*: Нуль або більше цифр.
      //          \.?: Нуль або одна десяткова кома (крапка).\d+: Одна або більше цифр.$: Кінець рядка.
      return parseFloat(value);
    } else {
      return value;
    }
  });
};
//відображення меню операцій
const showOperationMenu = () => {
  cli.question(
    `Choose an operation:
1. Sort words alphabetically
2. Show numbers from lesser to greater
3. Show numbers from bigger to smaller
4. Display words in ascending order by the number of letters
5. Show only unique words
6. Display only unique values
Enter the number corresponding to your choice: `,
    choice => {
      switch (parseInt(choice)) {
        case 1: // Відібрати та відсортувати слова за алфавітом
          const words = values.filter(value => typeof value === 'string');
          words.sort();
          console.log('Result: ', words.join(' '));
          break;
        case 2: // Відібрати та відсортувати числа від меншого до більшого
          const numbersLesser = values.filter(value => typeof value === 'number');
          numbersLesser.sort((a, b) => a - b);
          console.log('Result: ', numbersLesser.join(' '));
          break;
        case 3: // Відібрати та відсортувати числа від більшого до меншого
          const numbersGreater = values.filter(value => typeof value === 'number');
          numbersGreater.sort((a, b) => b - a);
          console.log('Result: ', numbersGreater.join(' '));
          break;
        case 4: // Відібрати та відсортувати слова за довжиною
          const wordsByLength = values.filter(value => typeof value === 'string');
          wordsByLength.sort((a, b) => a.length - b.length);
          console.log('Result: ', wordsByLength.join(' '));
          break;
        case 5: // Відібрати лише унікальні слова
          const uniqueWords = values.filter(
            (value, index, self) => self.indexOf(value) === index && typeof value === 'string',
          );
          console.log('Result: ', uniqueWords.join(' '));
          break;
        case 6: // Відібрати лише унікальні значення
          const uniqueValues = values.filter((value, index, self) => self.indexOf(value) === index);
          console.log('Result: ', uniqueValues.join(' '));
          break;
        default:
          console.log('Invalid choice. Please enter a valid choice (1-6).');
          showOperationMenu();
          return;
      }

      getUserInput();
    },
  );
};

getUserInput();
