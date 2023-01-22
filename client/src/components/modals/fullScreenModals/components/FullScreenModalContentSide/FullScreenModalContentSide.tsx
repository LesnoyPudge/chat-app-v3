import { FC, PropsWithChildren, useContext } from 'react';
import { Button, Icon, OverlayContext } from '@components';



const styles = {
    wrapper: `grow shrink basis-[800px] overflow-hidden 
    overflow-y-scroll scrollbar-primary`,
    inner: 'flex h-fit',
    content: 'max-w-[740px] py-[60px] px-10 flex-1',
    sidebar: 'pt-[60px] mr-5 basis-[36px] relative',
    buttonWrapper: 'grid gap-1.5 fixed',
    button: `grid place-items-center h-9 w-9 
    rounded-full border-2 border-icon-200 fill-icon-200
    hover:border-icon-100 hover:fill-icon-100 transition-all duration-75`,
    icon: 'h-5 w-5 transition-all duration-75',
    text: `font-semibold text-sm 
    text-muted text-center pointer-events-none`,
};

export const FullScreenModalContentSide: FC<PropsWithChildren> = ({ children }) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;

    return (
        <div className={styles.wrapper}>
            <div className={styles.inner}>
                <div className={styles.content}>
                    {children}
                </div>

                <div className={styles.sidebar}>
                    <div className={styles.buttonWrapper}>
                        <Button
                            className={styles.button}
                            label='Закрыть диалог'
                            onLeftClick={closeOverlay}
                        >
                            <Icon
                                className={styles.icon}
                                iconId='cross-icon'
                            />
                        </Button>

                        <span className={styles.text}>
                            <>ESC</>
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};