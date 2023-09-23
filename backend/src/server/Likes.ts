import { Request, Response } from 'express';
import { asyncResult } from './Handler';

const likeCache = new Map<string, object>() ;

async function getLiked(req?: Request, res?: Response): Promise<asyncResult> {
    let result: asyncResult = [Array.from(likeCache.values()), 200];
    return result
}

async function like(req: Request, res: Response): Promise<asyncResult> {
    if (!('body' in req && 'title' in req.body)) {
        const result: asyncResult = [{}, 400];
        return result
    }
    console.log(`Body: ${req.body}`)
    const singleJsonObject = req.body;
    likeCache.set(singleJsonObject.title, singleJsonObject);
    const result: asyncResult = [{}, 200];
    return result
}

async function unlike(req: Request, res: Response) {
    if (!('body' in req && 'title' in req.body)) {
        const result: asyncResult = [{}, 400];
        return result
    }
    console.log(`Body: ${req.body}`)
    const singleJsonObject = req.body;
    likeCache.delete(singleJsonObject.title);
    const result: asyncResult = [{}, 200];
    return result
}

export {likeCache, getLiked, like, unlike};