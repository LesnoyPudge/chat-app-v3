import { FC } from "react";
import { Button, SpriteImage } from "@components";
import { FullScreenModalCloseButton } from "../FullScreenModalCloseButton";
import { cn } from "@utils";
import { useContextProxy } from "@lesnoypudge/utils-react";
import { FullScreenModalContext } from "../FullScreenModalContextProvider";
import { RT } from "@lesnoypudge/types-utils-react/namespace";



type FullScreenModalMobileControls = (
    RT.PropsWithClassName
    & {
        withBurgerButton?: boolean;
    }
)

const styles = {
    mobileControlsWrapper: 'flex mobile:hidden pb-4',
    dialogCloseButton: 'ml-auto',
    burgerButton: {
        base: 'size-9 stroke-white-black',
        hidden: 'hidden'
    },
};

export const FullScreenModalMobileControls: FC<FullScreenModalMobileControls> = ({
    className = '',
    withBurgerButton = false,
}) => {
    const {
        openMobileMenu, 
        isMobileMenuOpen,
        triggerScreenShake,
        isDirtyRef,
    } = useContextProxy(FullScreenModalContext)

    return (
        <div className={cn(styles.mobileControlsWrapper, className)}>
            <Button 
                className={cn(styles.burgerButton.base, {
                    [styles.burgerButton.hidden]: (
                        isMobileMenuOpen || !withBurgerButton
                    )
                })}
                label='Открыть меню'
                onLeftClick={() => {
                    if (isDirtyRef.current) return triggerScreenShake();
                    openMobileMenu()
                }}
            >
                <SpriteImage name='BURGER_BARS'/>
            </Button>

            <FullScreenModalCloseButton className={styles.dialogCloseButton}/>
        </div>
    )
}