import { createContext, FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import ReactAutoSizer, { SizeType, AutoSizerProps } from '@oyyds/react-auto-sizer';



type AutoSizerType = Omit<AutoSizerProps, keyof PropsWithChildren> & {
    children: ReactNode | ((args: AutoSizerContextType) => JSX.Element);
};

export type AutoSizerContextType = SizeType;

export const AutoSizerContext = createContext<AutoSizerContextType | undefined>(undefined);

export const AutoSizer: FC<AutoSizerType> = ({
    children,
    ...rest
}) => {
    return (
        <ReactAutoSizer {...rest}>
            {({ height = 0, width = 0 }) => {
                const contextValues: AutoSizerContextType = { height, width };
                const content = children instanceof Function ? children(contextValues) : children;

                return (
                    <AutoSizerContext.Provider value={contextValues}>
                        {content}
                    </AutoSizerContext.Provider>
                );
            }}
        </ReactAutoSizer>
    );
};