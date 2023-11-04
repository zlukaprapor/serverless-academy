const express = require('express');
const app = express();
const bodyParser = require('body-parser');


// Parse JSON data from requests
app.use(bodyParser.json());

// In-memory storage for JSON documents
const jsonStore = {};


// PUT endpoint to store JSON documents
app.put('/:json_path', (req, res) => {
    const jsonPath = req.params.json_path;
    const jsonData = req.body;

    if (!jsonPath || !jsonData) {
        return res.status(400).json({error: 'Invalid JSON data or path'});
    }

    jsonStore[jsonPath] = jsonData;
    res.json({message: 'JSON data stored successfully'});
});


// GET endpoint to access previously stored JSON
app.get('/:json_path', (req, res) => {
    const jsonPath = req.params.json_path;
    const jsonData = jsonStore[jsonPath];

    if (!jsonPath || !jsonData) {
        return res.status(404).json({error: 'JSON data not found'});
    }

    res.json(jsonData);
});

// Start the Express server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`JSON storage service is running on port ${port}`);
});