import { RTEModules, RTETypes } from '@components';
import { tryParseJSON } from '@utils';
import { FC, useMemo } from 'react';
import { Descendant } from 'slate';



export const RTESerialized: FC<{value: string | RTETypes.Nodes}> = ({ value }) => {
    const result = useMemo(() => {
        const parsed = (
            typeof value === 'string'
                ? tryParseJSON<RTETypes.Nodes>(value)
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