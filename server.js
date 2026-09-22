const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.static(path.join(__dirname)));

app.get('/download', async (req, res) => {
    const instaUrl = req.query.url;
    if (!instaUrl) {
        return res.status(400).json({ error: 'URL ആവശ്യമാണ്' });
    }

    try {
        const options = {
            method: 'GET',
            url: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
            params: { url: instaUrl },
            headers: {
                'x-rapidapi-key': '9bb44b83d9msh229dffb50b3886ep1e5bd1jsn5eb35fb49ef9',
                'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        res.json({ video_url: response.data.picker[0].video });
    } catch (error) {
        res.status(500).json({ error: 'വീഡിയോ ഡൗൺലോഡ് ചെയ്യാൻ സാധിച്ചില്ല' });
    }
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
