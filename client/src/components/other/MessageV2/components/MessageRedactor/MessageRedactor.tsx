import { Button, Scrollable } from '@components';
import { useResizeObserver } from '@hooks';
import { SlateContainer, SlateEditor } from '@libs';
import { PropsWithClassName } from '@types';
import { FC, useEffect, useRef, useState } from 'react';
import { Descendant } from 'slate';
import { ReactEditor, useSlateStatic } from 'slate-react';



interface MessageRedactor extends PropsWithClassName {
    content: string;
}

const parseContent = (content: string) => {
    const parsed = JSON.parse(content);
    const notEmptyArray = Array.isArray(parsed) && !!parsed.length;

    if (notEmptyArray) return parsed as Descendant[];

    return [{ type: 'paragraph', children: [{ text: '' }] }] satisfies Descendant[];
}; 

export const MessageRedactor: FC<MessageRedactor> = ({
    className = '',
    content,
}) => {
    const [redactorValue, setRedactorValue] = useState<Descendant[]>(() => (parseContent(content)));

    return (
        <SlateContainer
            value={redactorValue} 
            onChange={setRedactorValue}
        >
            <MessageRedactorInner className={className}/>
        </SlateContainer>
    );
};

const styles = {
    wrapper: '',
    controlWrapper: 'text-xs text-color-primary mt-1',
    controlButton: 'inline',
};

const MessageRedactorInner: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const editor = useSlateStatic();
    const editorWrapperRef = useRef<HTMLDivElement | null>(null);

    useResizeObserver(() => ReactEditor.toDOMNode(editor, editor), ([entry]) => {
        if (!editorWrapperRef.current) return;
        editorWrapperRef.current.style.height = entry.borderBoxSize[0].blockSize + 'px';
    });

    const handleSave = () => console.log('save');
    const handleCancel = () => console.log('cancel');

    return (
        <div className={className}>
            <div 
                className='flex pr-2 rounded-md bg-primary-100 min-h-[40px] max-h-[50vh]'
                ref={editorWrapperRef}
            >
                <Scrollable 
                    className='h-full'
                    label='Редактируемое сообщение'
                    small
                    autoHide
                >
                    <SlateEditor
                        className='min-h-full p-2'
                        placeholder='Введите отредактированное сообщение'
                        label='Редактируемое сообщение'
                    />
                </Scrollable>

                <div>some</div>
            </div>

            <div className={styles.controlWrapper}>
                <>Esc для </>

                <Button 
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Отменить редактирование'
                    onLeftClick={handleCancel}
                >
                    <>отмены</>
                </Button>

                <> | Enter чтобы </>

                <Button 
                    className={styles.controlButton}
                    stylingPreset='link'
                    label='Сохранить отредактированное сообщение'
                    onLeftClick={handleSave}
                >
                    <>сохранить</>
                </Button>
            </div>
        </div>
    );
};