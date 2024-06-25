import { useContextSelectable } from '@lesnoypudge/utils-react';
import { cn } from '@utils';
import { FC, PropsWithChildren } from 'react';
import { FullScreenModalContext } from '../FullScreenModalContextProvider';
import { pick } from '@lesnoypudge/utils';
import { ScrollableV2 } from 'src/dev/WIP/ScrollableV2';
import { FocusInside } from '@components';



const styles = {
    wrapper: {
        base: 'flex grow shrink-0 bg-primary-300',
        hidden: 'hidden'
    },
    scrollable: 'flex justify-end w-full',
    content: 'w-full max-w-[218px] max-mobile:max-w-full py-[60px] pl-5 pr-1.5',
}

export const FullScreenModalNavigationSide: FC<PropsWithChildren> = ({ 
    children 
}) => {
    const {
        isMobileContentVisible,
        isMobileMenuVisible,
    } = useContextSelectable(FullScreenModalContext, (v) => {
        return pick(
            v, 
            'isMobileContentVisible',
            'isMobileMenuVisible'
        )
    });

    return (
        <FocusInside focused={isMobileMenuVisible}>
            {({wrapperRef}) => (
                <div 
                    className={cn(styles.wrapper.base, {
                        [styles.wrapper.hidden]: isMobileContentVisible
                    })}
                    ref={wrapperRef}
                >
                    <ScrollableV2 className={styles.scrollable}>
                        <div className={styles.content}>
                            {children}
                        </div>
                    </ScrollableV2>
                </div>
            )}
        </FocusInside>
    );
};