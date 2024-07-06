import { cn } from '@utils';
import { CSSProperties, FC } from 'react';



type Separator = {
    className?: string;
    spacing?: number;
    thickness?: number;
    height?: number;
    orientation?: 'horizontal' | 'vertical';
}

const styles = {
    wrapper: {
        base: 'shrink-0 bg-primary-100',
        vertical: `h-[var(--height)] w-[var(--thickness)] my-auto 
        mx-[var(--spacing)]`,
        horizontal: 'h-[var(--thickness)] mx-auto my-[var(--spacing)]',
    }
};

export const Separator: FC<Separator> = ({ 
    className = '', 
    spacing = 8, 
    thickness = 2, 
    height = 10,
    orientation = 'horizontal',
}) => {
    const style = {
        '--spacing': `${spacing}px`,
        '--thickness': `${thickness}px`,
        '--height': `${height}px`,
    } as CSSProperties;
    
    return (
        <div 
            className={cn(
                styles.wrapper.base,
                styles.wrapper[orientation],
                className,
            )}
            style={style}
            role='separator'
        ></div>
    );
};