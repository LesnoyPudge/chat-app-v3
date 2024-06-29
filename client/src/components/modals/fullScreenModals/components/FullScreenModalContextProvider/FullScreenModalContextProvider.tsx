import { createContextSelectable } from "@lesnoypudge/utils-react";
import { FC, PropsWithChildren } from "react";
import { useMobileMenu, useShake } from "./hooks";
import { useRefWithSetter } from "@hooks";



type ContextValue = (
    ReturnType<typeof useMobileMenu>
    & ReturnType<typeof useShake>
    & {
        isDirtyRef: ReturnType<typeof useRefWithSetter<boolean>>[0];
        setIsDirty: ReturnType<typeof useRefWithSetter<boolean>>[1];
    }
)

export const FullScreenModalContext = createContextSelectable<ContextValue>();

export const FullScreenModalContextProvider: FC<PropsWithChildren> = ({
    children
}) => {
    const mobileMenu = useMobileMenu()
    const shake = useShake()
    const [isDirtyRef, setIsDirty] = useRefWithSetter(false)
    
    const contextValue: ContextValue = {
        ...mobileMenu,
        ...shake,
        isDirtyRef,
        setIsDirty,
    }

    return (
        <FullScreenModalContext.Provider value={contextValue}>
            {children}
        </FullScreenModalContext.Provider>
    )
}