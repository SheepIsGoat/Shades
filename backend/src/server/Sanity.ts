import axios, { AxiosResponse } from 'axios';
import { Request, Response } from 'express';
import { asyncResult } from './Handler';

const SANITY_TOKEN: string | undefined = process.env.SANITY_TOKEN;

async function searchSanity(req: Request, res: Response): Promise<asyncResult> {
    const searchTerm: string | undefined = req.query.q ? req.query.q.toString() : undefined;
  
    if (!searchTerm) {
        const result: asyncResult = [{'Error': 'Search term is required'}, 400]
        return result;
    }
    
    const sanityQuery = buildSanityQuery(searchTerm);
    let sanityResponse = await querySanity(sanityQuery);
    let processedSanityResponse = processSanityResponse(sanityResponse);
    const result: asyncResult = [processedSanityResponse, 200]
    return result;
}

function buildSanityQuery(searchTerm: string): string {
    console.log("Received search request " + searchTerm);
    const cleanSearchTerm: string = cleanQuery(searchTerm);
    const query: string = `*[_type == "tile" && title match "${cleanSearchTerm}*"]{name,title,summary,slug,status,publishDate,owner,sharingImage1x1Url}`;
    const encodedQuery = encodeURIComponent(query);
    return encodedQuery;
}

async function querySanity(sanityQuery: string): Promise<AxiosResponse> {
    const url = `https://0unlbb72.api.sanity.io/v2022-03-29/data/query/dev?query=${sanityQuery}`;
    const options = {
        headers: {
            'Authorization': `Bearer ${SANITY_TOKEN}`
        }
    }
    const response = await axios.get(url, options);
    return response;
}

function processSanityResponse(response: AxiosResponse): object {
    let data = response.data;
    delete data.query
    return data
}

const naughtyChars = new Set(['\0', '\x08', '\x09', '\x1a', '\n', '\r', '"', "'", '\\', '%', '[', ']', '{', '}', ',']);
function cleanQuery(queryString: string): string {
    // Should use official list in prod, this is just a small example
    // https://github.com/minimaxir/big-list-of-naughty-strings
    
    let sanitizedQuery = '';
    for (const char of queryString) {
        if (!naughtyChars.has(char)) {
            sanitizedQuery += char;
        }
    }

    return sanitizedQuery;
}

export {searchSanity};