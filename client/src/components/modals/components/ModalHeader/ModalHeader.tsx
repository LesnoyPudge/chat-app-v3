import { Button,SpriteImage, OverlayContext } from '@components';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useContext } from 'react';



const styles = {
    wrapper: 'relative flex flex-col py-6 px-4 items-center gap-2',
    button: `absolute top-0.5 right-0.5 w-8 h-8 p-1 
    fill-icon-300 hover:fill-icon-100 focus-visible:fill-icon-100`,
    icon: 'w-full h-full',
};

export const ModalHeader: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            {children}

            <Button
                className={styles.button}
                onLeftClick={closeOverlay}
                label='Закрыть диалог'
            >
                <SpriteImage
                    className={styles.icon}
                    name='CROSS_ICON'
                />
            </Button>
        </div>
    );
};