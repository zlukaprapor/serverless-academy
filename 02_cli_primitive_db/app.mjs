import fs from 'fs';
import inquirer from 'inquirer';

const databaseFilePath = 'userDatabase.txt';

//завантаження користувачів з файлу
function loadUsers() {
    try {
        const data = fs.readFileSync(databaseFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

//збереження користувачів до файлу
function saveUsers(users) {
    fs.writeFileSync(databaseFilePath, JSON.stringify(users, null, 2));
}

//додавання користувача
async function addUser() {
    const users = loadUsers();
    const newUser = {};

    const { name } = await inquirer.prompt({ type: 'input', name: 'name', message: 'Enter user name:' });
    if (!name) {
        console.log('User addition canceled.');
        await main();
        return;
    }


    newUser.name = name;

    const { gender } = await inquirer.prompt({ type: 'list', name: 'gender', message: 'Choose gender:', choices: ['Male', 'Female', 'Other'] });
    newUser.gender = gender;

    const { age } = await inquirer.prompt({ type: 'number', name: 'age', message: 'Enter user age:' });
    newUser.age = age;

    users.push(newUser);
    saveUsers(users);
    console.log('User added successfully. To cancel press ENTER');
    addUser(); // Recursively add more users
}

//пошуку користувача за іменем

// меню програми
async function main() {


    await addUser();
}


// Start the application
main();