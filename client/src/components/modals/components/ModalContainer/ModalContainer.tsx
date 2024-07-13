import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { ScrollableV2 } from 'src/dev/WIP/ScrollableV2';



const styles = {
    wrapper: `flex flex-col justify-between w-[min(440px,100vw)] 
    shadow-elevation-high bg-primary-200 rounded`,
};

export const ModalContainer: FC<PropsWithChildrenAndClassName> = ({
    className = '',
    children,
}) => {
    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <ScrollableV2 
                className='max-h-[90dvh]'
                size='small' 
                direction='vertical'
                withoutGutter
            >
                {children}
            </ScrollableV2>
        </div>
    );
};