import { pick } from "@lesnoypudge/utils";
import { createContextSelectable } from "@lesnoypudge/utils-react";
import { AppSelectors } from "@redux/features";
import { useMemoSelectorV2 } from "@redux/hooks";
import { Dispatch, FC, PropsWithChildren, SetStateAction, useState } from "react";



type ContextValue = {
    isMobileMenuOpen: boolean;
    setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
    isMobileMenuVisible: boolean;
    isMobileContentVisible: boolean;
}

export const FullScreenModalContext = createContextSelectable<ContextValue>();

export const FullScreenModalContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
    const {isMobile} = useMemoSelectorV2((state) => {
        return pick(AppSelectors.selectAppState(state), 'isMobile')
    })
    
    const contextValue: ContextValue = {
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        isMobileContentVisible: isMobile && !isMobileMenuOpen,
        isMobileMenuVisible: isMobile && isMobileMenuOpen,
    }

    return (
        <FullScreenModalContext.Provider value={contextValue}>
            {children}
        </FullScreenModalContext.Provider>
    )
}