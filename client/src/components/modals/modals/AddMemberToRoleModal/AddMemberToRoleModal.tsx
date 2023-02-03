import { ModalWindow } from '@components';
import { FC } from 'react';



interface AddMemberToRoleModal {
    roleId: string;
    onMemberAdd: (memberId: string) => void;
}

export const AddMemberToRoleModal: FC<AddMemberToRoleModal> = ({
    roleId,
    onMemberAdd,
}) => {
    return (
        <ModalWindow 
            label='Добавить участников' 
            withBackdrop
        >
            <div>
                wow: {roleId}

                <button onClick={() => onMemberAdd('2')}>
                    add
                </button>
            </div>
        </ModalWindow>
    );
};