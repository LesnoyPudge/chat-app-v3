import { FC } from 'react';
import ReactAutoSizer, { AutoSizerProps } from '@oyyds/react-auto-sizer';
import { PropsWithChildrenAsNodeOrFunction, Size } from '@types';
import { ChildrenAsNodeOrFunction } from '@components';



type AutoSizer = PropsWithChildrenAsNodeOrFunction<Size> & Omit<AutoSizerProps, 'children'>;

export const AutoSizer: FC<AutoSizer> = ({
    children,
    ...rest
}) => {
    return (
        <ReactAutoSizer {...rest}>
            {({ height = 0, width = 0 }) => (
                <ChildrenAsNodeOrFunction args={{ height, width }}>
                    {children}
                </ChildrenAsNodeOrFunction>
            )}
        </ReactAutoSizer>
    );
};