import { ModelScheme, TableScheme, Where } from '../database/schemes/types';
import { getSchemeDBO } from '../database/schemes/utilities/getDBO';

const getModel = <S extends TableScheme>(scheme: S) => {
    const dbo = getSchemeDBO(scheme);
    return {
        create: async (
            objects: ModelScheme<S>[],
        ): Promise<Error | ModelScheme<S>[]> => {
            let preparedObjects = objects;

            const primaryKey = Object.keys(scheme.columns).find(
                (key) => scheme.columns[key].primaryKey,
            );

            if (primaryKey) {
                preparedObjects = preparedObjects.map((obj) => ({
                    ...obj,
                    [primaryKey]: crypto.randomUUID(),
                }));
            }

            return await dbo.insert(preparedObjects);
        },

        get: async (where: Where<S['columns']> = null) => {
            return await dbo.select(where);
        },
    };
};

export default getModel;
