import { FC, useContext } from "react";
import { Button, OverlayContext, SpriteImage } from "@components";
import { RT } from "@lesnoypudge/types-utils-react/namespace";
import { cn } from "@utils";



type FullScreenModalCloseButton = (
    RT.PropsWithClassName
    & {
        hint?: string;
    }
)

const styles = {
    button: `flex flex-col gap-1.5 items-center pointer-events-auto 
    border-icon-200 fill-icon-200 text-color-muted transition-all duration-75 
    hover:border-icon-100 hover:fill-icon-100 hover:text-color-primary 
    focus-visible:fill-icon-100 focus-visible:text-color-primary 
    focus-visible:border-icon-100`,
    iconWrapper: 'h-9 w-9 p-1.5 rounded-full border-2',
    icon: 'h-full w-full duration-75',
    text: 'max-mobile:hidden font-semibold text-xs transition-all duration-75',
}

export const FullScreenModalCloseButton: FC<FullScreenModalCloseButton> = ({
    className = '',
    hint
}) => {
    const {closeOverlay} = useContext(OverlayContext)

    return (
        <Button
            className={cn(styles.button, className)}
            label='Закрыть настройки'
            onLeftClick={closeOverlay}
        >
            <div className={styles.iconWrapper}>
                <SpriteImage
                    className={styles.icon}
                    name='CROSS_ICON'
                />
            </div>

            <div className={styles.text}>
                {hint}
            </div>
        </Button>
    )
}