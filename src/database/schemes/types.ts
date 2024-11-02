type Column = {
    type: 'INTEGER' | 'TEXT' | 'REAL' | 'BLOB' | 'NULL';
    primaryKey?: true;
    autoincrement?: true;
    notNull?: true;
};

type Columns = Record<string, Column>;

export type TableScheme = {
    tableName: string;
    columns: Columns;
};

type ColumnType<C extends Column> = C['type'] extends infer I
    ? I extends 'INTEGER' | 'REAL'
        ? number
        : C['type'] extends 'NULL'
          ? null
          : string
    : never;

type NullableColumns<C extends Columns> = keyof C extends infer I
    ? I extends keyof C
        ? C[I]['notNull'] extends true
            ? never
            : I
        : never
    : never;

export type ModelScheme<S extends TableScheme> = {
    [P in NullableColumns<S['columns']>]?: ColumnType<S['columns'][P]>;
} & {
    [P in Exclude<
        keyof S['columns'],
        NullableColumns<S['columns']>
    >]: ColumnType<S['columns'][P]>;
};

type WhereOperation = '==' | '!=' | '<' | '<=' | '>' | '>=';

type WhereToken<C extends Columns> = {
    [P in keyof C]: {
        type: 'PREDICATE';
        operation: WhereOperation;
        name: P extends string ? P : never;
    } & (
        | {
              value: ColumnType<C[P]>;
              valueType: 'DIRECT';
          }
        | {
              value: keyof C;
              valueType: 'REFERENCE';
          }
    );
}[keyof C];

export type Where<C extends Columns> =
    | {
          type: 'AND' | 'OR';
          predicates?: Where<C>[];
      }
    | WhereToken<C>
    | null;

export const whereConvert = <C extends Columns>(where: Where<C>): string => {
    if (!where) {
        return '';
    }
    switch (where.type) {
        case 'AND':
        case 'OR':
            if (where.predicates && where.predicates.length > 0) {
                return `(${where.predicates?.map(whereConvert).join(` ${where.type} `)})`;
            } else return '';
        case 'PREDICATE':
            if (typeof where.value === 'number')
                return `"${where.name as string}" ${where.operation} ${where.value}`;
            else
                return `"${where.name as string}" ${where.operation} '${where.value as string}'`;
        default:
            return '';
    }
};
