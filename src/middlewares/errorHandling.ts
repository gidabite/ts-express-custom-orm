import { NextFunction, Request, Response } from 'express';

import logAPI from '../utilities/logs/api';

type ErrorAPI = Error & {
    statusCode?: number;
};

const errorHandlingMiddleware = (
    e: ErrorAPI,
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    logAPI(req).error(JSON.stringify(e));

    res.status(e?.statusCode ? e.statusCode : 500).send(e);
    next();
};

export default errorHandlingMiddleware;
