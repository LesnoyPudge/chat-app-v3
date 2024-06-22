import { pick } from "@lesnoypudge/utils";
import { AppSelectors, AppSlice } from "@redux/features";
import { useAppDispatch, useMemoSelectorV2 } from "@redux/hooks";
import { FC } from "react";
import { Button } from "@components";



const styles = {
    button: `shrink-0 hidden xl:flex flex-col justify-between h-full 
    aspect-square px-3 py-4`,
    bar: 'bg-white-black w-full h-[2px]',
}

export const MobileMenuButton: FC = () => {
    const {dispatch} = useAppDispatch()
    const { isMobileMenuOpen } = useMemoSelectorV2((state) => pick(
        AppSelectors.selectAppState(state),
        'isMobileMenuOpen',
    ))
    
    const handleClick = () => {
        dispatch(AppSlice.actions.toggleMobileMenuState())
    }

    return (
        <Button 
            className={styles.button}
            isActive={isMobileMenuOpen}
            label='Перейти к меню'
            onLeftClick={handleClick}
        >
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
            <div className={styles.bar}></div>
        </Button>
    )
}