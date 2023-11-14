import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary';
import { PlainTextPlugin } from '@lexical/react/LexicalPlainTextPlugin';
import { FC, useContext } from 'react';
import { RichTextEditorContext } from '../RichTextEditorContextProvider';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';



const styles = {
    wrapper: 'relative',
    contentEditable: 'px-2 message-y-padding',
    placeholder: 'absolute inset-0 opacity-70 px-2 message-y-padding truncate pointer-events-none',
};

export const RichTextEditorEditable: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const {
        label,
        name,
        placeholder,
        maxLength,
    } = useContext(RichTextEditorContext);

    const contentEditableEl = (
        <ContentEditable
            className={styles.contentEditable}
            placeholder={placeholder}
            label={label}
            name={name}
            autoComplete='none'
            maxLength={maxLength}
            spellCheck
        />
    );

    const placeholderEl = (
        <div className={styles.placeholder}>
            {placeholder}
        </div>
    );

    return (
        <div className={twClassNames(styles.wrapper, className)}>
            <PlainTextPlugin
                contentEditable={contentEditableEl}
                placeholder={placeholderEl}
                ErrorBoundary={LexicalErrorBoundary}
            />
        </div>
    );
};