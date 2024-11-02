import { ModelScheme, TableScheme, Where, whereConvert } from '../types';
import db from '../../db';

export type SchemeDBO<S extends TableScheme> = {
    createTable: (ifNotExist: boolean) => Promise<Error | true>;
    insert: (objects: ModelScheme<S>[]) => Promise<Error | ModelScheme<S>[]>;
    select: (
        where: Where<S['columns']> | null,
    ) => Promise<Error | ModelScheme<S>[]>;
};

export const getSchemeDBO = <S extends TableScheme>(
    scheme: S,
): SchemeDBO<S> => ({
    createTable: async (ifNotExist: boolean = true) => {
        const { tableName, columns } = scheme;

        const columnDefinitions = Object.keys(columns)
            .map((column) => {
                let columnDef = `"${column}" ${columns[column].type}`;
                if (columns[column].primaryKey) {
                    columnDef += ' PRIMARY KEY';
                }
                if (columns[column].autoincrement) {
                    columnDef += ' AUTOINCREMENT';
                }
                if (columns[column].notNull) {
                    columnDef += ' NOT NULL';
                }
                return columnDef;
            })
            .join(', ');

        return await db.run(
            `CREATE TABLE ${ifNotExist ? 'IF NOT EXISTS' : ''} "${tableName}" (${columnDefinitions});`,
        );
    },
    insert: async (objects: ModelScheme<S>[]) => {
        const { tableName, columns } = scheme;

        const columnHeaders = Object.keys(columns)
            .map((column) => `"${column}"`)
            .join(', ');

        const columnValuesGaps = objects
            .map(
                () =>
                    '(' +
                    Object.keys(columns)
                        .map(() => '?')
                        .join() +
                    ')',
            )
            .join(', ');

        const columnValues = objects
            .map((object) =>
                Object.keys(columns).map((column) =>
                    object[column as keyof typeof object]
                        ? object[column as keyof typeof object]
                        : 'NULL',
                ),
            )
            .reduce((acc, current) => [...acc, ...current], []);

        await db.run(
            `INSERT INTO "${tableName}" (${columnHeaders}) VALUES ${columnValuesGaps}`,
            ...columnValues,
        );

        return objects;
    },
    select: async (where: Where<S['columns']> = null) => {
        let whereClause = whereConvert(where);
        whereClause = whereClause != '' ? `WHERE ${whereClause}` : '';
        const sql = `SELECT * FROM "${scheme.tableName}" ${whereClause}`;

        return (await db.all(sql)) as ModelScheme<S>[];
    },
});
