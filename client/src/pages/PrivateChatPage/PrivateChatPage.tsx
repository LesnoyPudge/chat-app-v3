import { ExtraStatusType, StatusType } from '@backendTypes';
import { TopBar } from '@components';
import { useNavigator } from '@hooks';
import React, { FC, useEffect, useRef, useState } from 'react';



interface IPrivateChat {
    id: string;
    friend: {
        id: string;
        avatar: string;
        username: string;
        status: StatusType;
        extraStatus: ExtraStatusType;
    }
}

const privateChats: IPrivateChat[] = [
    {
        id: '1',
        friend: {
            id: '1',
            avatar: 'qwe',
            username: 'friend 1',
            status: 'online',
            extraStatus: 'default',
        },
    },
    {
        id: '2',
        friend: {
            id: '2',
            avatar: 'qwe',
            username: 'friend 2',
            status: 'online',
            extraStatus: 'afk',
        },
    },
    {
        id: '3',
        friend: {
            id: '3',
            avatar: 'qwe',
            username: 'friend 3',
            status: 'offline',
            extraStatus: 'default',
        },
    },
    {
        id: '4',
        friend: {
            id: '4',
            avatar: 'qwe',
            username: 'friend 4',
            status: 'online',
            extraStatus: 'dnd',
        },
    },
];

export const PrivateChatPage: FC = () => {
    const { params } = useNavigator();
    const friend = privateChats.filter(item => item.id === params.privateChatId)[0].friend;
    const [value, setValue] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    const initialHeightRef = useRef<number | null>(null);
    const inputRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        if (!textareaRef.current) return;
        const target = textareaRef.current;
        // const setHeight = (target: HTMLElement) => {
        target.style.height = '0px';
        target.style.height = target.scrollHeight + 'px';
        target.scrollTo({ behavior: 'auto', top: target.scrollHeight });
        console.log([...target.value.matchAll(/\n/g)].length);
        // };
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.currentTarget.value);
    };

    const handleKeydown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.code !== 'Enter') return;
        e.preventDefault();
        if (!e.shiftKey) return console.log('submit');

        e.preventDefault();
        setValue(prev => prev + '\n');
    };

    // useEffect(() => {
    //     if (!textareaRef.current) return;
    //     const textarea = textareaRef.current;
    //     // if (!initialHeightRef.current) initialHeightRef.current = textarea.clientHeight;

    //     const handleInput = (e: KeyboardEvent) => {
    //         e.preventDefault();
    //         const target = e.target as HTMLTextAreaElement;
    //         target.style.height = '0px';
    //         target.style.height = target.scrollHeight + 'px';
    //         console.log(target.scrollHeight, target.clientHeight, target.offsetHeight);
    //     };

    //     textarea.addEventListener('keydown', handleInput);

    //     return () => {
    //         textarea.removeEventListener('keydown', handleInput);
    //     };
    // }, []);

    // useEffect(() => {
    //     if (!inputRef.current) return;
    //     const input = inputRef.current;

    //     const handleKeydown = (e: KeyboardEvent) => {
    //         console.log(e.key);
    //     };

    //     input.addEventListener('keydown', handleKeydown);

    //     return () => {
    //         input.removeEventListener('keydown', handleKeydown);
    //     };
    // }, []);

    return (
        <>
            <TopBar>
                {friend.username}
            </TopBar>

            <ul>chat</ul>

            <div 
                className='flex min-h-[44px] max-h-[50vh] mt-auto 
                mb-6 mx-4 rounded-lg bg-primary-100'
            >
                <button>attach</button>

                <textarea
                    // contentEditable
                    className='w-full max-h-[50vh] whitespace-pre-line min-h-full p-2
                    overflow-x-hidden overflow-y-auto custom-scrollbar-variant-primary'
                    // type='text'
                    placeholder={`Написать ${friend.username}`}
                    value={value}
                    onChange={handleChange}
                    onKeyDown={handleKeydown}
                    // onChange={(e) => {
                    //     console.log('change');
                    //     setValue(e.currentTarget.value);
                    // }}
                    // onKeyDown={(e) => {
                    //     if (e.code === 'Enter') {
                    //         console.log('enter');
                    //         e.preventDefault();
                    //         setValue(prev => prev + '\n');
                    //     }
                    // }}
                    rows={1}
                    ref={textareaRef}
                    // ref={inputRef}
                ></textarea>

                <button>send</button>
            </div>
        </>
    );
};