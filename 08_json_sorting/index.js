const axios = require('axios');
const fs = require('fs');
const util = require('util');
const MAX_RETRIES = 3;
const writeFile = util.promisify(fs.writeFile);
async function fetchDataWithRetries(endpoint) {
    let retries = 0;
    while (retries < MAX_RETRIES) {
        try {
            const response = await axios.get(endpoint);
            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            retries++;
        }
    }
    return null;
}

async function processEndpoint(endpoint) {
    const data = await fetchDataWithRetries(endpoint);

    switch (true) {
        case data !== null && data.isDone !== undefined:
            return {
                success: true,
                isDone: data.isDone,
            };
        case data !== null:
            return {
                success: false,
                message: `'isDone' key not found`,
            };
        default:
            return {
                success: false,
                message: 'The endpoint is unavailable',
            };
    }
}

async function main() {
    try {
        const urlsData = fs.readFileSync('urls.json', 'utf-8');
        const urls = JSON.parse(urlsData);

        let trueCount = 0;
        let falseCount = 0;

        for (let i = 0; i < urls.length; i++) {
            const endpoint = urls[i];
            const fileName = `data_${i + 1}.json`;
            await processEndpoint(endpoint, fileName);
        }

        console.log(`Found True values: ${trueCount}`);
        console.log(`Found False values: ${falseCount}`);
    } catch (error) {
        console.error('Error reading "urls.json" or processing endpoints:', error);
    }
}

main();