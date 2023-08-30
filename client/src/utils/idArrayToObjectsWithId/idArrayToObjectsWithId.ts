import { WithId } from '@shared';



export const idArrayToObjectsWithId = (ids: string[]): WithId[] => {
    return ids.map((id) => ({
        id,
    }));
};