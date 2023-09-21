const dotenv = require('dotenv');
dotenv.config({ path: './process.env' });

const express = require('express');
const path = require('path');
const axios = require('axios');
// const cors = require('cors');

import { Request, Response } from 'express';
// import { createClient } from '@sanity/client';



const app = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

const SANITY_TOKEN: string | undefined = process.env.SANITY_TOKEN;

// const SANITY_ENV: string = "dev";
// const sanity = createClient({
//   projectId: '0unlbb72',
//   dataset: SANITY_ENV,
//   apiVersion: '2022-03-29',
//   token: SANITY_TOKEN,
//   useCdn: true,
// });


function cleanQuery(query: string): string {
    return query.replace(/[\0\x08\x09\x1a\n\r"'\\\%\[\]\{\},]/g, (char) => {
        switch (char) {
            case "\0":
                return "\\0";
            case "\x08":
                return "\\b";
            case "\x09":
                return "\\t";
            case "\x1a":
                return "\\z";
            case "\n":
                return "\\n";
            case "\r":
                return "\\r";
            case "\"":
            case "'":
            case "\\":
            case "%":
            case "[":
            case "]":
            case "{":
            case "}":
            case ",":
                return "\\"+char; 
            default:
                return char;
        }
    });
}

app.get('/search', async (req: Request, res: Response) => {
    const searchTerm: string | undefined = req.query.q ? req.query.q.toString() : undefined;
  
    if (!searchTerm) {
        return res.status(400).send('Search term is required');
    }
  
    const cleanSearchTerm: string = cleanQuery(searchTerm);
    const query: string = `*[_type == "tile" && title match "${cleanSearchTerm}*"]{name,title,header,slug,status,publishDate,owner}`;
    const encodedQuery = encodeURIComponent(query);
  
    try {
        const response = await axios.get(`https://0unlbb72.api.sanity.io/v2022-03-29/data/query/dev?query=${encodedQuery}`, {
            headers: {
                'Authorization': `Bearer ${SANITY_TOKEN}`
            }
        });
        res.json(response.data);
    } catch (error: any) {
        console.error('Error:', error.message);
        res.status(500).send('Internal Server Error');
    }
  });

export {};