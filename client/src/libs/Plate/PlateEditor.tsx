import { TEditableProps, Plate } from '@udecode/plate';
import classNames from 'classnames';
import { FC, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';



interface IPlateEditor {
    className?: string;
    placeholder?: string;
}

const baseClassName = `w-full max-h-[50vh] my-auto p-2 pt-2.5 
placeholder:text-placeholder min-h-[44px] break-all 
overflow-y-auto custom-scrollbar-variant-primary`;

export const PlateEditor: FC<IPlateEditor> = ({
    className = '',
    placeholder = 'Введите сообщение',
}) => {
    const editableProps: TEditableProps = useMemo(() => ({
        className: twMerge(classNames(baseClassName, { [className]: !!className })),
        placeholder,
        spellCheck: false,
        autoFocus: false,
    }), [className, placeholder]);
    
    return (
        <Plate
            
            editableProps={editableProps}
        />
    );
};