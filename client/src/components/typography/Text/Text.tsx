import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { ColorType, FSType, FWType } from '../types';



interface IText extends PropsWithChildren {
    className?: string;
    fw?: FWType;
    fs?: FSType;
    color?: ColorType;
    isUppercase?: boolean;
    isLowercase?: boolean;
}

export const Text: FC<IText> = ({ 
    children,
    className = '',
    fs,
    fw,
    isUppercase,
    isLowercase,
    color,
}) => {
    const textCN = classNames({
        [className]: !!className,
        [`fs-${fs}`]: !!fs,
        [`fw-${fw}`]: !!fw,
        ['uppercase']: !!isUppercase,
        ['lowercase']: !!isLowercase,
        [`text-${color}`]: !!color,
    });

    return (
        <div className={textCN}>
            {children}
        </div>
    );
};