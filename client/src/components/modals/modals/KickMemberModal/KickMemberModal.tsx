import { ModalWindow } from '@components';
import { FC } from 'react';



interface KickMemberModal {
    memberId: string;
    channelId: string;
}

export const KickMemberModal: FC<KickMemberModal> = ({
    memberId,
    channelId,
}) => {
    return (
        <ModalWindow 
            label={`Выгнать пользователя ${memberId}`} 
            withBackdrop
        >
            <>wow</>
        </ModalWindow>
    );
};