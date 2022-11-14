import { createContext, FC, PropsWithChildren, ReactNode, useMemo } from 'react';
import ReactAutoSizer, { SizeType, AutoSizerProps } from '@oyyds/react-auto-sizer';
import { ChildrenOrFunction, Conditional, PropsWithChildrenOrFunction } from '@components';



type AutoSizerType = Omit<AutoSizerProps, keyof PropsWithChildren> & PropsWithChildrenOrFunction & {
    withContext?: boolean;
}

export type AutoSizerContextType = SizeType;

export const AutoSizerContext = createContext<AutoSizerContextType | undefined>(undefined);

export const AutoSizer: FC<AutoSizerType> = ({
    withContext = false,
    children,
    ...rest
}) => {
    return (
        <ReactAutoSizer {...rest}>
            {({ height = 0, width = 0 }) => {
                const contextValues: AutoSizerContextType = { height, width };
                const childrenOrFunction = <ChildrenOrFunction
                    childrenOrFunction={children}
                    args={contextValues}
                />;

                return (
                    <>
                        <Conditional isRendered={withContext}>
                            <AutoSizerContext.Provider value={contextValues}>
                                {childrenOrFunction}
                            </AutoSizerContext.Provider>
                        </Conditional>

                        <Conditional isRendered={!withContext}>
                            {childrenOrFunction}
                        </Conditional>
                    </>
                );
            }}
        </ReactAutoSizer>
    );
};