const fs = require('fs');

const rawData = fs.readFileSync('data.json');
const data = JSON.parse(rawData);

const users = {};

// Ітеруємо кожен запис в JSON
data.forEach(entry => {
  const userId = entry.user._id;
  const userName = entry.user.name;
  const vacationPeriod = {
    startDate: entry.startDate,
    endDate: entry.endDate,
  };

  // Перевірка, чи користувач вже існує в об'єкті users
  if (!users[userId]) {
    users[userId] = {
      userId,
      userName,
      vacations: [],
    };
  }

  // Пушим відпустку до масиву користувача
  users[userId].vacations.push(vacationPeriod);
});

const result = Object.values(users);

fs.writeFileSync('transformed_data.json', JSON.stringify(result, null, 2), 'utf-8');

console.log('The data has been converted and saved to a file: transformed_data.json.');
