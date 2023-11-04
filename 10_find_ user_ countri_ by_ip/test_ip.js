const axios = require('axios');

// Функція для виконання запиту до Express-додатку
const checkCountryByIP = async (ip) => {
    try {
        const response = await axios.get(`http://localhost:3000/detect-location?ip=${ip}`);
        console.log(`IP: ${ip}, Country: ${response.data.userCountry}`);
    } catch (error) {
        console.error(error);
    }
};

// Виконайте запити для перевірки країн
checkCountryByIP('45.232.208.143');  // Для Чилі
checkCountryByIP('185.182.120.34');  // Для Арменії
checkCountryByIP('45.177.176.23');   // Для Мексики
checkCountryByIP('5.44.80.51');      // Для Туреччини
checkCountryByIP('91.149.48.22');    // Для Норвегії
checkCountryByIP('83.229.33.3');     // Для Іспанії
checkCountryByIP('203.24.108.65');   // Для Кіпру
checkCountryByIP('23.43.23.15');    // Для Великої Британії (UK)
checkCountryByIP('89.28.176.5');     // Для Ірландії
checkCountryByIP('77.83.248.211');   // Для Румунії