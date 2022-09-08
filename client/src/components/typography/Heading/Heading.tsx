import classNames from 'classnames';
import { PropsWithChildren , FC } from 'react';
import { ColorType, FSType, FWType } from '../types';



interface IHeading extends PropsWithChildren {
    level: 1 | 2 | 3 | 4 | 5 | 6;
    size: 's' | 'm' | 'l' | 'xl' | 'xxl';
    fw?: FWType;
    color?: ColorType;
    className?: string;
}

export const Heading: FC<IHeading> = ({ 
    children, 
    level, 
    size,
    fw,
    color,
    className = '',
}) => {
    const HeadingTag = `h${level}` as unknown as keyof JSX.IntrinsicElements;
    const headingClasses = classNames({
        [`headingSize__${size}`]: true,
        [`fw-${fw}`]: !!fw,
        [`text-${color}`]: !!color,
        [className]: !!className,
    });

    return (
        <HeadingTag className={headingClasses}>
            {children}
        </HeadingTag>
    );
};