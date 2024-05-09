import { RTEModules } from '@components';
import { PropsWithClassName } from '@types';
import { FC, useContext, useEffect, useMemo } from 'react';
import { Editable, useSlate } from 'slate-react';
import { RTEContext } from '../RTEContextProvider';
import { twJoin } from 'tailwind-merge';
import styles from './RTEContentEditable.module.scss';



export const RTEContentEditable: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const editor = useSlate();
    const cv = useContext(RTEContext);

    const onKeyDown = useMemo(() => {
        return RTEModules.Events.KeyDown(editor, cv.onSubmit);
    }, [cv.onSubmit, editor]);

    useEffect(() => console.log('contenteditable'));

    return (
        <Editable
            className={twJoin(styles.editor, className)}
            renderElement={RTEModules.Render.renderElement}
            renderLeaf={RTEModules.Render.renderLeaf}
            onKeyDown={onKeyDown}
            aria-label={cv.label}
            placeholder={cv.placeholder}
            maxLength={cv.maxLength}
            name={cv.name}
            suppressContentEditableWarning
            spellCheck
        />
    );
};