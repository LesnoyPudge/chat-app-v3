import { FC, useContext, useRef } from 'react';
import { Button, ModalWindow, OverlayContext, RolesAndMembersCheckList, SearchBar } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';
import { useTextInput } from '@hooks';



interface RoomWhitelistModal extends Pick<RolesAndMembersCheckList, 'members' | 'roles'> {
    onSubmit: (values: {
        members: Set<string>;
        roles: Set<string>;
    }) => void;
}

export const RoomWhitelistModal: FC<RoomWhitelistModal> = ({
    members,
    roles,
    onSubmit,
}) => {
    const { closeOverlay } = useContext(OverlayContext) as OverlayContext;
    const { handleChange, handleReset, value } = useTextInput('');
    const checkedMembersIdRef = useRef(new Set<string>());
    const checkedRolesIdRef = useRef(new Set<string>());

    const checkMember = (id: string) => checkedMembersIdRef.current.add(id);
    const checkRole = (id: string) => checkedRolesIdRef.current.add(id);

    const getIsMemberChecked = (id: string) => checkedMembersIdRef.current.has(id);
    const getIsRoleChecked = (id: string) => checkedRolesIdRef.current.has(id);

    const handleSubmit = () => {
        closeOverlay();
        onSubmit({
            members: checkedMembersIdRef.current,
            roles: checkedRolesIdRef.current,
        });
    };

    return (
        <ModalWindow 
            label='Добавить участников или роли'
            withBackdrop
        >
            <ModalContainer>
                <ModalHeader>
                    <ModalTitle>
                        <>Добавить участников или роли</>
                    </ModalTitle>

                    <ModalSubtitle>
                        <>room name</>
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    <SearchBar
                        className='h-10'
                        placeholder='Название роли или имя участника'
                        label='Поиск среди участников или ролей'
                        onChange={handleChange}
                        onReset={handleReset}
                        value={value}
                    />

                    <RolesAndMembersCheckList
                        className='max-h-[300px]'
                        roles={roles}
                        members={members}
                        checkMember={checkMember}
                        checkRole={checkRole}
                        getIsMemberChecked={getIsMemberChecked}
                        getIsRoleChecked={getIsRoleChecked}
                    />
                </ModalContent>

                <ModalFooter>
                    <Button
                        stylingPreset='lite'
                        size='medium'
                        onLeftClick={closeOverlay}
                    >
                        <>Отмена</>
                    </Button>

                    <Button
                        stylingPreset='brand'
                        size='medium'
                        onLeftClick={handleSubmit}
                    >
                        <>Готово</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};