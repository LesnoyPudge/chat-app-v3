import { pick } from "@lesnoypudge/utils";
import { AppSelectors, AppSlice } from "@redux/features";
import { useAppDispatch, useMemoSelectorV2 } from "@redux/hooks";
import { FC } from "react";
import { Button, SpriteImage } from "@components";



const styles = {
    button: 'shrink-0 mobile:hidden h-full aspect-square p-2.5',
    icon: 'stroke-white-black'
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
            <SpriteImage
                className={styles.icon}
                name='BURGER_BARS'
            />
        </Button>
    )
}