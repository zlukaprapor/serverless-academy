const express = require('express');
const axios = require('axios');
const csv = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3000;

const database = [];

fs.createReadStream('IP2LOCATION-LITE-DB1.CSV')
    .pipe(csv())
    .on('data', (row) => {
        const from = parseInt(row['from']);
        const to = parseInt(row['to']);
        const codeCountry = row['code'];
        const country = row['country'];
        database.push({ from, to, codeCountry, country });
    })
    .on('end', () => {
        console.log('CSV file processed successfully.');


    });

app.get('/detect-location', (req, res) => {
    const userIP = req.query.ip;
    const userCountry = findUserCountry(userIP);
    res.json({userIP, userCountry});
});

function findUserCountry(ip) {
    const userIP = ipToInt(ip);

    for (const entry of database) {
        if (userIP >= entry.from && userIP <= entry.to) {
            return entry.country;
        }
    }
    return 'Unknown';
}

function ipToInt(ip) {
    const parts = ip.split('.').map(Number);
    return parts[0] * 256 * 256 * 256 + parts[1] * 256 * 256 + parts[2] * 256 + parts[3];
}

app.listen(port, () => {
    console.log(`The server is running on the port ${port}`);
});

