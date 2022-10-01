import classNames from 'classnames';
import { FC, useEffect, useRef, useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { MessageInput, MessageInputV2 } from '..';



interface IMessageInputBar {
    className?: string;
    placeholder?: string;
}

export const MessageInputBar: FC<IMessageInputBar> = ({
    className = '',
    placeholder,
}) => {
    

    
    return (
        <div 
            className={twMerge(classNames(
                'flex min-h-[44px] max-h-[50vh] mt-auto mb-6 mx-4 rounded-lg bg-primary-100',
                { [className]: !!className },
            ))}
        >
            <button className='h-11'>attach</button>

            <MessageInput/>
            {/* <MessageInputV2/> */}

            <button className='h-11'>send</button>
        </div>
    );
};