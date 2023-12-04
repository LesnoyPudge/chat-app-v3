import { RTEModules } from '@components';
import { tryParseJSON } from '@utils';
import { FC, useMemo } from 'react';
import { Descendant } from 'slate';



export const RTESerialized: FC<{value: string | Descendant[]}> = ({ value }) => {
    const result = useMemo(() => {
        const parsed = (
            typeof value === 'string'
                ? tryParseJSON<Descendant[]>(value)
                : value
        );
        if (!parsed) return null;

        try {
            return RTEModules.Render.serialize(parsed);
        } catch (error) {
            return null;
        }
    }, [value]);

    return (
        <>
            {result}
        </>
    );
};