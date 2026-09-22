const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Homepage Route - Front-end User Interface
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Orbo Bee - Instagram Downloader</title>
        <style>
            body { font-family: Arial, sans-serif; background: #f4f4f9; text-align: center; padding: 50px 20px; }
            .container { max-width: 500px; margin: auto; background: white; padding: 30px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
            h1 { color: #e1306c; margin-bottom: 20px; }
            input { width: 80%; padding: 12px; border: 1px solid #ccc; border-radius: 6px; margin-bottom: 15px; outline: none; }
            button { width: 85%; padding: 12px; background: #e1306c; color: white; border: none; border-radius: 6px; font-weight: bold; cursor: pointer; }
            button:hover { background: #c1255b; }
            #result { margin-top: 20px; word-break: break-all; }
            video { width: 100%; border-radius: 8px; margin-top: 15px; }
            a { display: inline-block; margin-top: 10px; padding: 10px 15px; background: #28a745; color: white; text-decoration: none; border-radius: 5px; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Orbo Bee</h1>
            <p>Instagram Video Downloader</p>
            <input type="text" id="urlInput" placeholder="Paste Instagram Link Here..." />
            <br />
            <button onclick="downloadVideo()">Get Video</button>
            <div id="result"></div>
        </div>

        <script>
            async function downloadVideo() {
                const url = document.getElementById('urlInput').value;
                const resultDiv = document.getElementById('result');
                if (!url) {
                    alert('Please enter a valid Instagram URL');
                    return;
                }
                resultDiv.innerHTML = 'Fetching video... Please wait.';
                
                try {
                    const response = await fetch('/download?url=' + encodeURIComponent(url));
                    const data = await response.json();
                    
                    if (data && data.data) {
                        const videoUrl = data.data.video_url || (data.data[0] && data.data[0].url);
                        if (videoUrl) {
                            resultDiv.innerHTML = \`
                                <video controls src="\${videoUrl}"></video>
                                <br />
                                <a href="\${videoUrl}" target="_blank" download>Download Video</a>
                            \`;
                        } else {
                            resultDiv.innerHTML = 'Could not find video URL in response.';
                        }
                    } else {
                        resultDiv.innerHTML = 'Failed to fetch video. Check the link.';
                    }
                } catch (err) {
                    resultDiv.innerHTML = 'Error: ' + err.message;
                }
            }
        </script>
    </body>
    </html>
    `);
});

// 2. API Route - RapidAPI Integration
app.get('/download', async (req, res) => {
    const videoUrl = req.query.url;

    if (!videoUrl) {
        return res.status(400).json({ error: 'URL parameter is required' });
    }

    const options = {
        method: 'GET',
        url: 'https://social-download-all-in-one.p.rapidapi.com/v1/social/autolink',
        params: { url: videoUrl },
        headers: {
            'x-rapidapi-key': process.env.RAPIDAPI_KEY || 'YOUR_DEFAULT_API_KEY',
            'x-rapidapi-host': 'social-download-all-in-one.p.rapidapi.com'
        }
    };

    try {
        const response = await axios.request(options);
        res.json(response.data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch data from API', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
