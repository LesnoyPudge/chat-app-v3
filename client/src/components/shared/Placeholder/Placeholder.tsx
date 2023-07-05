import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useEffect, useRef } from 'react';



interface Placeholder extends PropsWithChildrenAndClassName {
    title?: string;
}

const styles = {
    base: 'animate-pulse',
};

export const Placeholder: FC<Placeholder> = ({
    className = '',
    title = 'Загрузка...',
    children,
}) => {
    const elementToSyncRef = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        if (!elementToSyncRef.current) return;

        elementToSyncRef.current.getAnimations().forEach((animation) => {
            animation.startTime = 0;
        });
    }, []);

    return (
        <div 
            className={twClassNames(styles.base, className)}
            title={title}
            ref={elementToSyncRef}
        >
            {children}
        </div>
    );
};