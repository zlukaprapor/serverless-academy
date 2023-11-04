const express = require('express');
const shortid = require('shortid');
const validUrl = require('valid-url');
const app = express();

app.use(express.json());

const urlMap = {};

app.post('/shorten', (req, res) => {
    const {url} = req.body;

    if (!validUrl.isUri(url)) {
        return res.status(400).json({error: 'Invalid URL'});
    }

    const shortUrl = shortid.generate();

    urlMap[shortUrl] = url;

    res.status(201).json({shortUrl});
});

app.get('/:shortUrl', (req, res) => {
    const {shortUrl} = req.params;

    const longUrl = urlMap[shortUrl];

    if (longUrl) {
        res.redirect(301, longUrl);
    } else {
        res.status(404).json({error: 'Shortened URL not found'});
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`The server is running on the port ${PORT}`);
});