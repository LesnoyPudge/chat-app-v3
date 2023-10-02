import { Emoji, EmojiCode } from '@components';
import { PropsWithChildrenAndClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { RenderElementAttributes } from '../../types';



type SlateEmoji = PropsWithChildrenAndClassName & {
    code: EmojiCode;
} & ({
    serialized?: never;
    attributes: RenderElementAttributes;
} | {
    serialized: true;
    attributes?: never;
})

const styles = {
    wrapper: 'inline-block mx-0.5 message-emoji-wrapper-size',
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
            <Emoji
                className={styles.emoji}
                code={code}
            />
            {children}
        </span>
    );
};