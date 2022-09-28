import { useIsFirstRender, useThrottle, useUpdateEffect } from '@hooks';
import classNames from 'classnames';
import { FC, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import useResizeObserver from '@react-hook/resize-observer';



interface IMessageInput {
    className?: string;
    placeholder?: string;
}

export const MessageInput: FC<IMessageInput> = ({
    className = '',
    placeholder = 'Введите сообщение',
}) => {
    const isFirstRender = useIsFirstRender();
    const { throttle } = useThrottle();
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const prevWidth = useRef<number | null>(null);

    const contentRef = useRef<HTMLDivElement | null>(null);

    const setHeight = useCallback(() => {
        if (!textareaRef.current) return;
        if (!contentRef.current) return;

        const textarea = textareaRef.current;
        const content = contentRef.current;

        textarea.style.height = '0px';
        textarea.style.height = textarea.scrollHeight + 'px';
        content.style.height = '0px';
        content.style.height = textarea.scrollHeight + 'px';
        // console.log(textarea.scrollHeight, content.scrollHeight, content.offsetHeight, content.getBoundingClientRect());
        textarea.scrollTo({ behavior: 'auto', top: textarea.scrollHeight });
        content.scrollTo({ behavior: 'auto', top: textarea.scrollHeight });
    }, []);

    const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code !== 'Enter') return;
        if (e.shiftKey) return;
        e.preventDefault();
        console.log('submit');
    };

    useResizeObserver(textareaRef, (entity) => {
        if (isFirstRender) return;
        if (!prevWidth.current) return;

        const entityElem = entity.target as HTMLElement;
        const entityWidth = entityElem.getBoundingClientRect().width;

        if (prevWidth.current === entityWidth) return;
        
        throttle(() => {
            prevWidth.current = entityWidth;
            setHeight();
        }, 100)();
    });

    useUpdateEffect(() => setHeight(), [value]);

    useUpdateEffect(() => {
        if (!contentRef.current) return;

        contentRef.current.textContent = value;
    }, [value]);

    useEffect(() => {
        if (!textareaRef.current) return;
        if (prevWidth.current) return;
        prevWidth.current = textareaRef.current.getBoundingClientRect().width;
    }, []);

    const handleScroll = (e: React.UIEvent) => {
        if (!contentRef.current) return;
        if (!textareaRef.current) return;
        contentRef.current.scrollTop = e.currentTarget.scrollTop;
        // console.log(contentRef.current, e.currentTarget);
    };

    return (
        <div className='relative w-full isolate overflow-hidden'>
            <textarea
                className={twMerge(classNames(
                    `w-full max-h-[50vh] whitespace-pre-line my-auto p-2 pt-2.5 min-h-[44px]
                    overflow-x-hidden overflow-y-auto custom-scrollbar-variant-primary 
                    bg-transparent text-transparent caret-white`,
                    { [className]: !!className },
                ))}
                placeholder={placeholder}
                value={value}
                onChange={(e) => setValue(e.currentTarget.value)}
                onKeyDown={handleKeydown}
                onScroll={handleScroll}
                rows={1}
                maxLength={3000}
                ref={textareaRef}
            />
            <div 
                className='w-full max-h-[50vh] whitespace-pre-line my-auto p-2 pt-2.5 min-h-[44px]
                overflow-x-hidden overflow-y-visible pointer-events-none h-full
                absolute top-0 left-0 -z-[1] pr-6 shrink-0 grow flex break-words'
                contentEditable
                style={{ width: prevWidth.current || 0 }}
                ref={contentRef}
            >  
            </div>
        </div>
    );
};