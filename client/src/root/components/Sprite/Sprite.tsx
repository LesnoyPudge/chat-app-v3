import { SPRITE } from '@generated';
import { FC } from 'react';



const html = {
    __html: SPRITE,
};

export const Sprite: FC = () => {
    return (
        <svg
            className='sr-only'
            xmlns='http://www.w3.org/2000/svg'
            dangerouslySetInnerHTML={html}
            aria-hidden
        ></svg>
    );
};