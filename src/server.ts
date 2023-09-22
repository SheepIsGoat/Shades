const dotenv = require('dotenv');
dotenv.config({ path: './process.env' });

const express = require('express');
const path = require('path');
const axios = require('axios');
// const cors = require('cors');

import { Request, Response, NextFunction } from 'express';
// import { createClient } from '@sanity/client';



const app = express();
const PORT: number = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'build')));
app.use((_: null, res: Response, next: NextFunction) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS'); // Allow specified HTTP methods
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept'); // Allow specified headers
    next();
});


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
    console.log("Received search request " + searchTerm)
    const cleanSearchTerm: string = cleanQuery(searchTerm);
    const query: string = `*[_type == "tile" && title match "${cleanSearchTerm}*"]{name,title,summary,slug,status,publishDate,owner,sharingImage1x1Url}`;
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

app.post('/like', async (req: Request, res: Response) => {
    handle([like, getLiked], res, req);
});

app.post('/unlike', async (req: Request, res: Response) => {
    handle([unlike, getLiked], res, req);
});

const likeCache = new Map<string, object>() ;

type RequestHandler = (res: Response, req: Request) => jsonAble;
type jsonAble = object | Array<object> | void;

function handle(funcs: Array<RequestHandler>, res: Response, req: Request){
    try {
        let response: jsonAble = []
        for (const func of funcs) {
            response = func(res, req)
        }
        console.log(`Returning ${response}`)
        res.status(200).json(response)
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

function getLiked(res?: Response, req?: Request): Array<object> {
    return Array.from(likeCache.values());
}

function like(res: Response, req: Request) {
    if ('body' in req && 'title' in req.body) {
        console.log(`Body: ${req.body}`)
        const singleJsonObject = req.body;
        likeCache.set(singleJsonObject.title, singleJsonObject);
        return
    }
}

function unlike(res: Response, req: Request) {
    if ('body' in req && 'title' in req.body) {
        console.log(`Body: ${req.body}`)
        const singleJsonObject = req.body;
        likeCache.delete(singleJsonObject.title);
        return
    }
}



export {};