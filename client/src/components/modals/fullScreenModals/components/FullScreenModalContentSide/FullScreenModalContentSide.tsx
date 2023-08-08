import { FC, PropsWithChildren, useContext } from 'react';
import { Button,SpriteImage, OverlayContext, Scrollable } from '@components';
import { FormConfirmationBar } from '../FormConfirmationBar';



const styles = {
    wrapper: 'flex grow shrink basis-[800px] relative',
    contentWrapper: 'max-w-[calc(740px+56px)] pr-[calc(40px+56px)]',
    toolbarWrapper: 'absolute flex-1 inset-0 pointer-events-none',
    toolbarInner: 'flex justify-end h-full max-w-[calc(740px+56px)] pt-[60px] mr-2',
    toolbarCol: 'flex flex-col w-[56px]',
    button: `flex flex-col gap-1.5 items-center w-auto fixed pointer-events-auto 
    border-icon-200 fill-icon-200 text-color-muted transition-all duration-75 
    hover:border-icon-100 hover:fill-icon-100 hover:text-color-primary focus-visible:fill-icon-100 focus-visible:text-color-primary focus-visible:border-icon-100`,
    iconWrapper: 'h-9 w-9 p-1.5 rounded-full border-2',
    icon: 'h-full w-full duration-75',
    text: 'font-semibold text-xs transition-all duration-75',
};

export const FullScreenModalContentSide: FC<PropsWithChildren> = ({ children }) => {
    const { closeOverlay } = useContext(OverlayContext);

    return (
        <div className={styles.wrapper}>
            <Scrollable>
                <div className={styles.contentWrapper}>
                    {children}
                </div>
            </Scrollable>

            <div className={styles.toolbarWrapper}>
                <div className={styles.toolbarInner}>
                    <div className={styles.toolbarCol}>
                        <Button
                            className={styles.button}
                            label='Закрыть диалог'
                            onLeftClick={closeOverlay}
                        >
                            <div className={styles.iconWrapper}>
                                <SpriteImage
                                    className={styles.icon}
                                    name='CROSS_ICON'
                                />
                            </div>

                            <span className={styles.text}>
                                <>ESC</>
                            </span>
                        </Button>
                    </div>
                </div>
            </div>

            <FormConfirmationBar/>
        </div>
    );
};