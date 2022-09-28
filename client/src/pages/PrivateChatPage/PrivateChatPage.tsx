import { ExtraStatusType, StatusType } from '@backendTypes';
import { TopBar } from '@components';
import { useNavigator } from '@hooks';
import React, { FC, useEffect, useRef, useState } from 'react';
import { MessageInputBar } from './components';



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

            <MessageInputBar/>
        </>
    );
};