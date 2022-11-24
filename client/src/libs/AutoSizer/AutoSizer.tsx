import { FC, PropsWithChildren } from 'react';
import ReactAutoSizer, { SizeType, AutoSizerProps } from '@oyyds/react-auto-sizer';
import { PropsWithChildrenAsFunction } from '@types';



type AutoSizerType = 
    Omit<AutoSizerProps, keyof PropsWithChildren> 
    & PropsWithChildrenAsFunction<Required<SizeType>>;

export const AutoSizer: FC<AutoSizerType> = ({
    children,
    ...rest
}) => {
    return (
        <ReactAutoSizer {...rest}>
            {({ height = 0, width = 0 }) => {
                const contextValues: Required<SizeType> = { height, width };
                return children(contextValues);
            }}
        </ReactAutoSizer>
    );
};