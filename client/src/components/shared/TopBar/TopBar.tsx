import { PropsWithChildrenAndClassName } from '@types';
import { cn } from '@utils';
import { FC } from 'react';
import { MobileMenuButton } from './components';



type TopBar = PropsWithChildrenAndClassName & {
    withMobileButton?: boolean;
}

const styles = {
    base: 'flex shrink-0 items-center h-12 shadow-elevation-low',
};

export const TopBar: FC<TopBar> = ({ 
    className = '',
    withMobileButton = false,
    children, 
}) => {
    return (
        <div className={cn(styles.base, className)}>
            <If condition={withMobileButton}>
                <MobileMenuButton/>
            </If>

            {children}
        </div>
    );
};