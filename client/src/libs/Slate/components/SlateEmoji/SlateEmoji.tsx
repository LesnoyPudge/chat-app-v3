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
    wrapper: 'inline-block mx-0.5',
    emoji: 'inline-block w-6 h-6',
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