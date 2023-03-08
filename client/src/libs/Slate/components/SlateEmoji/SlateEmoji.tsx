import { Emoji, EmojiCode } from '@components';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { RenderElementAttributes } from '../../types';



interface SlateEmoji extends PropsWithChildrenAndClassName {
    code: EmojiCode;
    attributes: RenderElementAttributes;
}

const styles = {
    wrapper: 'inline-block message-emoji-size',
    emoji: 'inline-block w-full h-full',
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