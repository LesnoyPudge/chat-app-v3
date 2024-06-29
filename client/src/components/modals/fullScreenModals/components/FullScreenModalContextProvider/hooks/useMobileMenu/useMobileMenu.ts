import { pick } from "@lesnoypudge/utils";
import { AppSelectors } from "@redux/features";
import { useMemoSelectorV2 } from "@redux/hooks";
import { useCallback, useState } from "react";



export const useMobileMenu = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(true);
    const {isMobile} = useMemoSelectorV2((state) => {
        return pick(AppSelectors.selectAppState(state), 'isMobile')
    })

    const openMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(true)
    }, [])

    const closeMobileMenu = useCallback(() => {
        setIsMobileMenuOpen(false)
    }, [])
    console.log({isMobile, isMobileMenuOpen})
    return {
        isMobileMenuOpen,
        closeMobileMenu,
        openMobileMenu,
        isMobileContentVisible: isMobile && !isMobileMenuOpen,
        isMobileMenuVisible: isMobile && isMobileMenuOpen,
    }
}