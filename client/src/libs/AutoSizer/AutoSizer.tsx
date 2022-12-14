import { FC } from 'react';
import ReactAutoSizer, { AutoSizerProps } from '@oyyds/react-auto-sizer';



export const AutoSizer: FC<AutoSizerProps> = ({
    children,
    ...rest
}) => {
    return (
        <ReactAutoSizer {...rest}>
            {({ height = 0, width = 0 }) => children({ height, width })}
        </ReactAutoSizer>
    );
};