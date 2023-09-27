import { FC, useContext } from 'react';
import { RichTextEditorContext } from '../ContextProvider';
import { SlateEditor } from '@libs';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';



const styles = {
    base: 'block w-full px-2 message-y-padding',
};

export const Editable: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const {
        label,
        name,
        placeholder,
        onSubmit,
        onKeyDown,
    } = useContext(RichTextEditorContext);

    return (
        <SlateEditor
            className={twClassNames(styles.base, className)}
            label={label}
            name={name}
            placeholder={placeholder}
            onSubmit={onSubmit}
            onKeyDown={onKeyDown}
        />
    );
};