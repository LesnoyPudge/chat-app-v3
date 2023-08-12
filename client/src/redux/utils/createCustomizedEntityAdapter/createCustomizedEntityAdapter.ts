import { IdSelector, Comparer, createEntityAdapter, current, EntityState } from '@reduxjs/toolkit';
import { getDiff } from '@utils';
import { WithId } from '@shared';
import { RootState } from '@redux/store';



export const createCustomizedEntityAdapter = <T extends WithId>(options?: {
    selectId?: IdSelector<T>;
    sortComparer?: false | Comparer<T>;
}) => {
    const defaultAdapter = createEntityAdapter(options);

    defaultAdapter.upsertOne = (state, providedEntity) => {
        const unwrappedState = current(state);
        const entity = (
            ('payload' in providedEntity && 'type' in providedEntity)
                ? providedEntity.payload
                : providedEntity
        );

        const storedEntity = unwrappedState.entities[entity.id];
        if (!storedEntity) return defaultAdapter.addOne(state, entity);

        return defaultAdapter.updateOne(state, {
            id: entity.id,
            changes: getDiff(storedEntity, entity),
        });
    };

    defaultAdapter.upsertMany = () => {
        throw new Error('Not implemented');
    };

    const customGetSelectors = (selectState: (state: any) => EntityState<T>) => {
        const selectors = defaultAdapter.getSelectors(selectState);

        return {
            ...selectors,

            selectById: (id: string) => {
                return (state: RootState) => {
                    return selectors.selectById(state, id);
                };
            },

            selectByIds: (ids: string[]) => {
                return (state: RootState) => {
                    const result: ReturnType<typeof selectors.selectAll> = [];
                    const entities = selectors.selectEntities(state);

                    ids.forEach((id) => {
                        const entity = entities[id];
                        if (entity) result.push(entity);
                    });

                    return result;
                };
            },
        };
    };

    return {
        ...defaultAdapter,
        customGetSelectors,
    };
};