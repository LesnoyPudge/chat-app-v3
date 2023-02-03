import { FC } from 'react';
import { ModalWindow } from '@components';



interface DeleteRoleModal {
    roleId: string;
}

export const DeleteRoleModal: FC<DeleteRoleModal> = ({
    roleId,
}) => {
    return (
        <ModalWindow 
            label={`Удалить роль ${roleId}`} 
            withBackdrop
        >
            <>wow</>
        </ModalWindow>
    );
};