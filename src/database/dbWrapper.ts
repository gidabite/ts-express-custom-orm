import { Database } from 'sqlite3';

type SqlQueryParam = string | number | Date | null;
type SqlQueryError = Error;
type SqlQueryRun = SqlQueryError | true;
type SqlQueryAll = SqlQueryError | object;

export type DBWrapper = {
    run: (sql: string, ...params: SqlQueryParam[]) => Promise<SqlQueryRun>;
    all: (sql: string, ...params: SqlQueryParam[]) => Promise<SqlQueryAll>;
};

const dbWrapper = (db: Database): DBWrapper => ({
    run: (sql: string, ...params: SqlQueryParam[]) =>
        new Promise<SqlQueryRun>((resolve, reject) => {
            const stmt = db.prepare(sql);
            stmt.run(...params, (err: SqlQueryError | null) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                }
                resolve(true);
            });
        }),
    all: (sql: string, ...params: SqlQueryParam[]) =>
        new Promise<SqlQueryAll>((resolve, reject) => {
            const stmt = db.prepare(sql);
            stmt.all(...params, (err: SqlQueryError | null, rows: object) => {
                stmt.finalize();
                if (err) {
                    reject(err);
                }
                resolve(rows);
            });
        }),
});

export default dbWrapper;
