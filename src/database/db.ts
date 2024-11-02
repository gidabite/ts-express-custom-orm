import sqlite3 from 'sqlite3';

import dbWrapper from './dbWrapper';

const db = dbWrapper(
    new sqlite3.Database('./src/database/db.db', sqlite3.OPEN_READWRITE),
);

export default db;
