import { IMAGES } from '@generated';
import { PropsWithClassName } from '@types';
import { FC } from 'react';



interface SpriteImage extends PropsWithClassName {
    name: keyof typeof IMAGES.SPRITE;
    style?: React.CSSProperties;
}

export const SpriteImage: FC<SpriteImage> = ({
    className = '',
    name,
    style,
}) => {
    const id = `#${name}`;

    return (
        <svg className={className} style={style}>
            <use xlinkHref={id}/>
        </svg>
    );
};