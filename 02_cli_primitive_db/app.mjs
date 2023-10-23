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

function displayUsers() {
    const users = loadUsers();
    if (users.length > 0) {
        console.log('List of Users:');
        users.forEach(user => {
            console.log(user);
        });
    } else {
        console.log('No users found.');
    }
}

//додавання користувача
async function addUser() {
    const users = loadUsers();
    const newUser = {};

    const {name} = await inquirer.prompt({
        type: 'input',
        name: 'name',
        message: 'Enter user name. To cancel press ENTER:'
    });
    if (!name) {
        console.log('User addition canceled.');
        await searchUser()
        return;
    }
    newUser.name = name;

    const {gender} = await inquirer.prompt({
        type: 'list',
        name: 'gender',
        message: 'Choose gender:',
        choices: ['Male', 'Female', 'Other']
    });
    newUser.gender = gender;

    const {age} = await inquirer.prompt({type: 'number', name: 'age', message: 'Enter user age:'});
    newUser.age = age;

    users.push(newUser);
    saveUsers(users);
    console.log('User added successfully.');
    await addUser()

}

// пошуку користувача
async function searchUser() {
    const users = loadUsers();

    const {searchChoice} = await inquirer.prompt({
        type: 'list',
        name: 'searchChoice',
        message: 'Wold you to search values in DB?',
        choices: ['Yes', 'No']
    });

    if (searchChoice === 'Yes') {
        displayUsers();

        const {searchName} = await inquirer.prompt({
            type: 'input',
            name: 'searchName',
            message: 'Enter user name you wanna find in DB:'
        });

        const searchResult = users.find(user => user.name.toLowerCase() === searchName.toLowerCase());

        if (searchResult) {
            console.log(`User ${searchResult.name} found:`);
            console.log(searchResult);
            console.log('Goodbye!');
        } else {
            console.log('User not found.');
            console.log('Goodbye!');
        }
    }
}

async function main() {
    await addUser();
}

main().then(() => {
    console.log('Application has finished.');
}).catch((error) => {
    console.error('An error occurred:', error);
});