import { FC, PropsWithChildren } from 'react';
import { FocusableListContextProvider, IWrapperProps } from '@components';



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