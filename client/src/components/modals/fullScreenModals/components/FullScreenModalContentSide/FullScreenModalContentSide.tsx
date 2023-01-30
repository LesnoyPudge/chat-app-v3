import { FC, PropsWithChildren, useContext } from 'react';
import { Button, Icon, OverlayContext } from '@components';
import { FormConfirmationBar } from '../FormConfirmationBar';



const styles = {
    wrapper: 'grow shrink basis-[800px] relative',
    inner: 'flex h-full overflow-hidden overflow-y-auto scrollbar-primary relative',
    content: 'h-fit max-w-[740px] pt-[60px] pb-24 px-10 flex-1',
    toolbar: 'flex basis-14 py-[60px]',
    button: `flex flex-col gap-1.5 items-center w-auto fixed border-icon-200 fill-icon-200
    text-color-muted transition-all duration-75 hover:border-icon-100 hover:fill-icon-100
    hover:text-color-primary focus-visible:fill-icon-100 focus-visible:text-color-primary
    focus-visible:border-icon-100`,
    iconWrapper: 'h-9 w-9 p-1.5 rounded-full border-2',
    icon: 'h-full w-full duration-75',
    text: 'font-semibold text-sm transition-all duration-75',
};

export const FullScreenModalContentSide: FC<PropsWithChildren> = ({ children }) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    {children}
                </div>

                <div className={styles.toolbar}>
                    <Button
                        className={styles.button}
                        label='Закрыть диалог'
                        onLeftClick={closeOverlay}
                    >
                        <div className={styles.iconWrapper}>
                            <Icon
                                className={styles.icon}
                                iconId='cross-icon'
                            />
                        </div>

                        <span className={styles.text}>
                            <>ESC</>
                        </span>
                    </Button>
                </div>
            </div>

            <FormConfirmationBar/>
        </div>
    );
};