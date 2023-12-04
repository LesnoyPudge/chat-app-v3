import { RTEModules } from '@components';
import { PropsWithClassName } from '@types';
import { twClassNames } from '@utils';
import { FC } from 'react';
import { Editable as ContentEditable, useSlate } from 'slate-react';



const styles = {
    editor: 'rich-text-editor',
};

export const RTEContentEditable: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const editor = useSlate();

    return (
        <ContentEditable
            className={twClassNames(styles.editor, className)}
            suppressContentEditableWarning
            renderElement={RTEModules.Render.renderElement}
            renderLeaf={RTEModules.Render.renderLeaf}
            // renderPlaceholder={}
            onKeyDown={RTEModules.Events.KeyDown(editor)}
        />
    );
};