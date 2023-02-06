import { ModalWindow } from '@components';
import { FC } from 'react';



interface AddMemberToRoleModal {
    roleId: string;
}

export const AddMemberToRoleModal: FC<AddMemberToRoleModal> = ({
    roleId,
}) => {
    return (
        <ModalWindow 
            label='Добавить участников' 
            withBackdrop
        >
            <div>
                wow: {roleId}

                <button onClick={() => console.log('add member')}>
                    add
                </button>
            </div>
        </ModalWindow>
    );
};