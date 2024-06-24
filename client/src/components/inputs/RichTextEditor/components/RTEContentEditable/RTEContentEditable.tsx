import { RTEModules } from '@components';
import { PropsWithClassName } from '@types';
import { FC, useContext } from 'react';
import { Editable, useSlate } from 'slate-react';
import { RTEContext } from '../RTEContextProvider';
import { twClassNames } from '@utils';



const styles = {
    editor: 'w-full message-font-size focus-hidden message-y-padding',
}

export const RTEContentEditable: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const editor = useSlate();
    const cv = useContext(RTEContext);

    return (
        <Editable
            className={twClassNames(styles.editor, className)}
            renderElement={RTEModules.Render.renderElement}
            renderLeaf={RTEModules.Render.renderLeaf}
            renderPlaceholder={RTEModules.Render.renderPlaceholder}
            onKeyDown={RTEModules.Events.KeyDown(editor, cv.onSubmit)}
            onFocus={RTEModules.Events.Focus(editor)}
            aria-label={cv.label}
            placeholder={cv.placeholder}
            maxLength={cv.maxLength}
            name={cv.name}
            readOnly={cv.disabled}
            suppressContentEditableWarning
            spellCheck
        />
    );
};