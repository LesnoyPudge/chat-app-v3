import { AppSlice } from "@redux/features";
import { useAppDispatch } from "@redux/hooks";
import { MOBILE_QUERY } from "@vars";
import { useEffect } from "react";



export const useMobileMedia = () => {
    const {dispatch} = useAppDispatch();

    useEffect(() => {
        const mediaQuery = window.matchMedia(MOBILE_QUERY);

        const handle = (e: MediaQueryListEvent) => {
            dispatch(AppSlice.actions.setIsMobile(e.matches))
        }

        mediaQuery.addEventListener('change', handle)
    
        return () => mediaQuery.removeEventListener('change', handle)
    }, [dispatch])
}