import { FC, PropsWithChildren } from 'react';
import { Scrollable, FocusInside } from '@components';
import { FormConfirmationBar } from '../FormConfirmationBar';
import { useContextSelectable } from '@lesnoypudge/utils-react';
import { FullScreenModalContext } from '../FullScreenModalContextProvider';
import { pick } from '@lesnoypudge/utils';
import { FullScreenModalCloseButton } from '../FullScreenModalCloseButton';



const styles = {
    wrapper: 'flex grow shrink basis-[800px] relative',
    contentWrapper: 'max-w-[calc(740px+56px)] pr-[calc(40px+56px)]',
    toolbarWrapper: 'absolute flex-1 inset-0 pointer-events-none',
    toolbarInner: 'flex justify-end h-full max-w-[calc(740px+56px)] pt-[60px] mr-2',
    toolbarCol: 'flex flex-col w-[56px]',
};

export const FullScreenModalContentSide: FC<PropsWithChildren> = ({ 
    children 
}) => {
    const {
        isMobileContentVisible,
    } = useContextSelectable(FullScreenModalContext, (v) => {
        return pick(v, 'isMobileContentVisible')
    })

    return (
        <FocusInside focused={isMobileContentVisible}>
            {({wrapperRef}) => (
                <div className={styles.wrapper} ref={wrapperRef}>
                    <Scrollable>
                        <div className={styles.contentWrapper}>
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