import { TableScheme } from '../types';

const orderScheme = {
    tableName: 'ORDER',
    columns: {
        id: {
            type: 'TEXT',
            primaryKey: true,
            notNull: true,
        },
        name: {
            type: 'TEXT',
            notNull: true,
        },
        type: {
            type: 'TEXT',
            notNull: true,
        },
        depth: {
            type: 'INTEGER',
            notNull: true,
        },
    },
} satisfies TableScheme;

export default orderScheme;
