import { Request, Response } from 'express';

type RequestHandler = (req: Request, res: Response) => Promise<asyncResult>;
type asyncResult = [jsonAble, httpStatusCode];
type jsonAble = object | Array<object> | void;
type httpStatusCode = 200 | 400 | 500;

async function handle(funcs: Array<RequestHandler>, req: Request, res: Response){
    try {
        let obj: jsonAble = {};
        let status: httpStatusCode = 500;
        for (const func of funcs) {
            [obj, status] = await func(req, res);
            if (status >= 400) {
                break;
            }
        }
        return res.status(status).json(obj);
    } catch(error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}

export type {RequestHandler, asyncResult, jsonAble, httpStatusCode};
export {handle};