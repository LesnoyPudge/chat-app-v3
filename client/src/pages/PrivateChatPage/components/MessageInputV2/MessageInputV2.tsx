import { FC, useMemo, useState } from 'react';
import { Plate, PlateProvider, TEditableProps, TElement, TText } from '@udecode/plate';
import { twMerge } from 'tailwind-merge';
import classNames from 'classnames';
import { PlateContentValue, SerializedPlateContent, softBreakPlugin } from '@libs';




interface IMessageInputV2 {
    className?: string;
    placeholder?: string;
}

const baseClassName = `w-full max-h-[50vh] my-auto p-2 pt-2.5 
placeholder:text-placeholder min-h-[44px] break-all 
overflow-y-auto custom-scrollbar-variant-primary`;

const initialValue: (TElement | TText)[] = [
    {
        type: 'paragraph',
        children: [{ text: 'paragraph' }],
    },
    {
        type: 'link',
        children: [{ text: 'heading' }],
        url: 'https://google.com',
    },
];

export const MessageInputV2: FC<IMessageInputV2> = ({
    className = '',
    placeholder = 'Введите ваше сообщение',
}) => {
    const [debugValue, setDebugValue] = useState<PlateContentValue>([{ text: '' }]);

    const editableProps: TEditableProps = useMemo(() => ({
        className: twMerge(classNames(baseClassName, { [className]: !!className })),
        placeholder,
        spellCheck: false,
        autoFocus: false,
    }), [className, placeholder]);

    return (
        <div className='w-full flex'>
            <PlateProvider 
                onChange={(newValue) => {
                    setDebugValue(newValue);
                    console.log(newValue);
                    // save newValue...
                }}
                plugins={[softBreakPlugin]}
            >
                <Plate
                    editableProps={editableProps}
                />
            </PlateProvider>

            <SerializedPlateContent nodes={debugValue}/>
        </div>
    );
};