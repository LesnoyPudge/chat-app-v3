import { FC } from 'react';
import { SlateEditor, SerializedSlateContent, SlateContainer, useAddEmoji } from '@libs';
import { useSlate } from 'slate-react';



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
                className='min-h-[44px]'
            />

            <Debug/>

            <AddEmojiButton/>
        </SlateContainer>
    );
};

const AddEmojiButton: FC = () => {
    const { addEmoji } = useAddEmoji();
    
    const handleClick = () => addEmoji('');

    return (
        <button onClick={handleClick}>
            <>add emoji</>
        </button>
    );
};

const Debug: FC = () => {
    const editor = useSlate();

    return (
        <div>
            <SerializedSlateContent nodes={editor.children}/>
        </div>
    );
};