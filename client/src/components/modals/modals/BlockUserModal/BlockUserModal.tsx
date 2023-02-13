import { ModalWindow } from '@components';
import { FC } from 'react';



interface BlockUserModal {
    userId: string;
}

export const BlockUserModal: FC<BlockUserModal> = ({
    userId,
}) => {
    return (
        <ModalWindow 
            label={`Заблокировать пользователя ${userId}`} 
            withBackdrop
        >
            <>wow</>
        </ModalWindow>
    );
};