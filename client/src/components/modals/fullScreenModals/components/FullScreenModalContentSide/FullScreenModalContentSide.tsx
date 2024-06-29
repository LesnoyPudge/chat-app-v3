import { FC, PropsWithChildren } from 'react';
import { Scrollable, FocusInside } from '@components';
import { FormConfirmationBar } from '../FormConfirmationBar';
import { useContextProxy } from '@lesnoypudge/utils-react';
import { FullScreenModalContext } from '../FullScreenModalContextProvider';
import { FullScreenModalCloseButton } from '../FullScreenModalCloseButton';
import { cn } from '@utils';
import { FullScreenModalMobileControls } from '../FullScreenModalMobileControls';



const styles = {
    wrapper: {
        base: 'flex grow shrink basis-[800px] relative',
        hidden: 'hidden'
    },
    contentWrapper: ` max-mobile:max-w-full max-w-[calc(740px+56px)] 
    pr-[calc(40px+56px)] pt-[60px] pl-10 pb-24 max-mobile:pr-4 max-mobile:pl-4`,
    toolbarWrapper: 'max-mobile:hidden absolute flex-1 inset-0 pointer-events-none',
    toolbarInner: 'flex justify-end h-full max-w-[calc(740px+56px)] pt-[60px] mr-2',
    toolbarCol: 'flex flex-col w-[56px]',
};

export const FullScreenModalContentSide: FC<PropsWithChildren> = ({ 
    children 
}) => {
    const {
        isMobileContentVisible,
        isMobileMenuVisible,
    } = useContextProxy(FullScreenModalContext)
    
    return (
        <FocusInside focused={isMobileContentVisible}>
            {({wrapperRef}) => (
                <div 
                    className={cn(styles.wrapper.base, {
                        [styles.wrapper.hidden]: isMobileMenuVisible,
                    })} 
                    ref={wrapperRef}
                >
                    <Scrollable>
                        <div className={styles.contentWrapper}>
                            <FullScreenModalMobileControls withBurgerButton/>

                            {children}
                        </div>
                    </Scrollable>
        
                    <div className={styles.toolbarWrapper}>
                        <div className={styles.toolbarInner}>
                            <div className={styles.toolbarCol}>
                                <FullScreenModalCloseButton hint='ESC'/>
                            </div>
                        </div>
                    </div>
        
                    <FormConfirmationBar/>
                </div>
            )}
        </FocusInside>
    );
};