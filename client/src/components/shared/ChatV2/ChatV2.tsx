import { FC } from 'react';



export const MessageFeed: FC = () => {
    return (
        <>
        </>
    );
};

const InputBarBase: FC = () => {
    return (
        <>
        </>
    );
};

const InputBarPlaceholder: FC = () => {
    return (
        <>
        </>
    );
};

const InputBarDisabled: FC = () => {
    return (
        <>
        </>
    );
};

const InputBarReady: FC = () => {
    return (
        <>
        </>
    );
};

export const InputBar = {
    Placeholder: InputBarPlaceholder,
    Disabled: InputBarDisabled,
    Ready: InputBarReady,
};

export const ChatV2: FC = () => {
    return (
        <div>
            <MessageFeed/>

            <InputBar.Placeholder/>
        </div>
    );
};