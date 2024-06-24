import { FC, PropsWithChildren } from 'react';
import { Outlet } from 'react-router-dom';
import { UserToolBar } from './components';
import { useMemoSelectorV2 } from '@redux/hooks';
import { AppSelectors } from '@redux/features';
import { cn } from '@utils';
import { FocusInside } from '@components';
import { MoveFocusInside } from 'react-focus-lock';



const styles = {
    wrapper: 'flex w-full overflow-hidden',
    navigation: {
        base: 'flex flex-col bg-primary-300 w-full max-w-[240px] overflow-hidden',
        hidden: 'hidden',
        wide: 'max-w-full'
    },
    content: {
        base: 'flex flex-col bg-primary-200 w-full flex-1 overflow-hidden',
        hidden: 'hidden'
    },
}

export const SplittedPageLayout: FC<PropsWithChildren> = ({ children }) => {
    const {
        isMobileMenuShown
    } = useMemoSelectorV2(AppSelectors.isMobileMenuShown)
    const {
        isMobileContentShown
    } = useMemoSelectorV2(AppSelectors.isMobileContentShown)
    
    return (
        <div className={styles.wrapper}>
            <div className={cn(styles.navigation.base, {
                [styles.navigation.hidden]: isMobileContentShown,
                [styles.navigation.wide]: isMobileMenuShown,
            })}>
                {children}
                
                <UserToolBar/>
            </div>

            <FocusInside focused={isMobileContentShown}>
                {({wrapperRef}) => (
                    <div 
                        className={cn(styles.content.base, {
                            [styles.content.hidden]: isMobileMenuShown,
                        })}
                        ref={wrapperRef}
                    >
                        <Outlet/>
                    </div>
                )}
            </FocusInside>
        </div>
    );
};