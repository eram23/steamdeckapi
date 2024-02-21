const PORT = process.env.PORT || 8000;
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');


const app = express();

const newspapers = [
    {
        name: 'pcgamer',
        address: 'https://www.pcgamer.com/',
        base: ''
    },
    {
        name: 'steamdeckverified',
        address: 'https://www.steamdeck.com/en/verified',
        base: ''
    },
    {
        name: 'steamdeck',
        address: 'https://www.steamdeck.com/en/news',
        base: ''
    },
    {
        name: 'steamdecklife',
        address: 'https://steamdecklife.com/category/steam-deck-news/',
        base: ''
    },
    {
        name: 'steamdeckhq',
        address: 'https://steamdeckhq.com/',
        base: ''
    },
    {
        name: 'gamespot',
        address: 'https://www.gamespot.com/news/',
        base: ''
    },
    {
        name: 'kotaku',
        address: 'https://kotaku.com/culture/news',
        base: ''
    },
    {
        name: 'ign',
        address: 'https://www.ign.com/news',
        base: ''
    },
    {
        name: 'ign-pc',
        address: 'https://www.ign.com/pc',
        base: ''
    },
    {
        name: 'theverge',
        address: 'https://www.theverge.com/games',
        base: ''
    },
    {
        name: 'screenrant',
        address: 'https://screenrant.com/gaming/',
        base: ''
    },
    {
        name: 'gameinformer',
        address: 'https://www.gameinformer.com/',
        base: ''
    },
    {
        name: 'polygon',
        address: 'https://www.polygon.com/',
        base: ''
    },
    {
        name: 'gamesradar',
        address: 'https://www.gamesradar.com/news/',
        base: ''
    },
]

const articles = [];

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("Steam Deck")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            });
        });
    }); 
});

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("Valve")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            });
        });
    }); 
});

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
    .then(response => {
        const html = response.data;
        const $ = cheerio.load(html);

        $('a:contains("Steam")', html).each(function () {
            const title = $(this).text();
            const url = $(this).attr('href');

            articles.push({
                title,
                url,
                source: newspaper.name
            });
        });
    }); 
});

app.get('/', (req, res) => {
    res.json('Welcome to my SteamDeck news API!');
});

app.get('/news', (req, res) => {
    res.json(articles);
});

app.get('/news/:newspaperId', async (req, res) => {
    const newspaperId = req.params.newspaperId;

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address;
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base;
    
    axios.get(newspaperAddress)
        .then(response => {
           const html = response.data;
           const $ = cheerio.load(html);
           const specificArticle = [];

           $('a:contains("steamdeck")', html).each(function () {
                const title = $(this).text();
                const url = $(this).attr('href');
                specificArticle.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                });
           });
           res.json(specificArticle);
        }).catch(err => console.log(err));
});

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`));