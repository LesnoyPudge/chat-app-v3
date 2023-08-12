import { Button, MessageContext } from '@components';
import { PropsWithClassName } from '@types';
import { FC, useContext } from 'react';



export const MessageUsername: FC<PropsWithClassName> = ({
    className = '',
}) => {
    const { tabIndex, ids } = useContext(MessageContext);

    return (
        <Button
            className={className}
            id={ids.usernameId}
            hasPopup='menu'
            label='user menu'
            isActive={false}
            tabIndex={tabIndex}
            onLeftClick={() => console.log('open user related menu')}
            onRightClick={() => console.log('open user related menu')}
        >
            <>tmp name</>
        </Button>
    );
};