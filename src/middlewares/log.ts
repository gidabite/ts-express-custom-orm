import { NextFunction, Request, Response } from 'express';

import logAPI from '../utilities/logs/api';

const logMiddleware = (req: Request, res: Response, next: NextFunction) => {
    logAPI(req).info('Received');

    res.on('finish', function () {
        logAPI(req).info(`Processed with code ${res.statusCode}`);
    });

    next();
};

export default logMiddleware;
