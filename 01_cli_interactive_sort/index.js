const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function getUserInput() {
    rl.question('Enter a few words or numbers separated by a space (or type "exit" to quit): ', (input) => {
        if (input.toLowerCase() === 'exit') {
            rl.close();
        } else {
            processInput(input);
        }
    });
}

function processInput(input) {
    const values = input.split(' ').map((value) => {
        if (!isNaN(value)) {
            return parseFloat(value);
        } else {
            return value;
        }
    });

    rl.question(`Choose an operation:
1. Sort words alphabetically
2. Show numbers from lesser to greater
3. Show numbers from bigger to smaller
4. Display words in ascending order by the number of letters
5. Show only unique words
6. Display only unique values
Enter the number corresponding to your choice: `, (choice) => {
        switch (parseInt(choice)) {
            case 1:
                values.sort();
                break;
            case 2:
                values.sort((a, b) => a - b);
                break;
            case 3:
                values.sort((a, b) => b - a);
                break;
            case 4:
                values.sort((a, b) => a.toString().length - b.toString().length);
                break;
            case 5:
               // values = values.filter((value, index, self) => self.indexOf(value) === index && typeof value === 'string');
                break;
            case 6:
               // values = values.filter((value, index, self) => self.indexOf(value) === index);
                break;
            default:
                console.log('Invalid choice. Please enter a valid choice (1-6).');
                processInput(input);
                return;
        }

        console.log('Result: ', values.join(' '));
        getUserInput();
    });
}

getUserInput();