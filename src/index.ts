import express from 'express';
import bodyParser from 'body-parser';

import logFactory from './utilities/logs';
import logMiddleware from './middlewares/log';
import errorHandlingMiddleware from './middlewares/errorHandling';
import router from './routes';

import { getSchemeDBO } from './database/schemes/utilities/getDBO';
import orderScheme from './database/schemes/order';

const app = express();
app.use(logMiddleware);
app.use(bodyParser.json());
app.use('/', router);
app.use(errorHandlingMiddleware);

app.listen(3000, async () => {
    await getSchemeDBO(orderScheme).createTable(true);
    logFactory().info('Express server initialized');
});
