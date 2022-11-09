import { FC, memo, PropsWithChildren, useContext, useMemo } from 'react';
import { FocusableListContext, FocusableListContextProvider, IFocusableListContext, IWrapperProps } from '@components';



type FocusableListWrapperType = PropsWithChildren & Omit<React.HTMLAttributes<HTMLDivElement>, keyof IWrapperProps>

export const FocusableListWrapper: FC<FocusableListWrapperType> = ({ children, ...rest }) => {
    return (
        <FocusableListContextProvider>
            {({ wrapperProps }) => (
                <div {...wrapperProps} {...rest}>
                    {children}
                </div>
            )}
        </FocusableListContextProvider>
    );
};