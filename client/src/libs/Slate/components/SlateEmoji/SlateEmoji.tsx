import { Emoji, EmojiCode, RefContext, RefContextProvider } from '@components';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { RenderElementAttributes } from '../../types';



interface SlateEmoji extends PropsWithChildrenAndClassName {
    code: EmojiCode;
    attributes: RenderElementAttributes;
}

const styles = {
    wrapper: 'inline-block h-6 aspect-square mx-0.5',
    emoji: 'inline-block w-full h-auto',
};

export const SlateEmoji: FC<SlateEmoji> = ({ 
    className = '',
    code,
    attributes,
    children,
}) => {
    return (
        <span
            className={twClassNames(styles.wrapper, className)}
            contentEditable={false}
            draggable={false}
            {...attributes}
        >
            {children}
                
            <Emoji
                className={styles.emoji}
                code={code}
            />
        </span>
    );
};