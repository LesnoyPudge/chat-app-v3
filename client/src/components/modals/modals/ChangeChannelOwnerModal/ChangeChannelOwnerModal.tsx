import { FC } from 'react';
import { ModalWindow } from '@components';
import { ModalContainer } from '../../components';



interface ChangeChannelOwnerModal {
    memberId: string;
    channelId: string;
}

export const ChangeChannelOwnerModal: FC<ChangeChannelOwnerModal> = ({
    memberId,
    channelId,
}) => {
    return (
        <ModalWindow label='Сменить владельца канала' withBackdrop>
            <ModalContainer>
                <></>
            </ModalContainer>
        </ModalWindow>
    );
};