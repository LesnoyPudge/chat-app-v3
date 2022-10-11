import { FC } from 'react';
import { SlateEditor, SerializedSlateContent, SlateContainer, useAddEmoji } from '@libs';
import { useSlate } from 'slate-react';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';



interface IMessageInput {
    className?: string;
    placeholder?: string;
}

export const MessageInput: FC<IMessageInput> = ({
    className = '',
    placeholder = 'Введите сообщение',
}) => {
    
    return (
        <SlateContainer>
            <SlateEditor
                className={twMerge(classNames('min-h-[44px] py-[11px]', className))}
                placeholder={placeholder}
            />
            
            {/* <Serialized/>
            <Debug/> */}
            <AddEmojiButton/>
        </SlateContainer>
    );
};

const AddEmojiButton: FC = () => {
    const { addEmoji } = useAddEmoji();
    
    const handleClick = () => addEmoji(':poop:');

    return (
        <button onClick={handleClick}>
            <>add emoji</>
        </button>
    );
};

const Serialized: FC = () => {
    const editor = useSlate();

    return (
        <div>
            <SerializedSlateContent nodes={editor.children}/>
        </div>
    );
};

const Debug: FC = () => {
    const editor = useSlate();
    console.log(editor);
    return (
        <div>
            {/* {JSON.stringify(editor.children)} */}
        </div>
    );
};