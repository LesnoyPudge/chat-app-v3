import { FC, useContext } from 'react';
import { Button, ModalWindow, OverlayContext, RolesAndMembersCheckList, SearchBar } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';
import { useTextInput, useSet } from '@hooks';



interface RoomWhitelistModal extends Pick<RolesAndMembersCheckList, 'members' | 'roles'> {
    onSubmit: (values: {
        members: Set<string>;
        roles: Set<string>;
    }) => void;
}

const styles = {
    searchBar: 'h-10 mb-2',
    rolesAndMembers: 'max-h-[300px]',
};

export const RoomWhitelistModal: FC<RoomWhitelistModal> = ({
    members,
    roles,
    onSubmit,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    const { handleChange, handleReset, value } = useTextInput('');
    const [checkedMembersId, membersActions] = useSet<string>();
    const [checkedRolesId, rolesActions] = useSet<string>();

    const handleSubmit = () => {
        closeOverlay();
        onSubmit({
            members: checkedMembersId,
            roles: checkedRolesId,
        });
    };

    const filteredMembers = members.filter((member) => member.username.includes(value));
    const filteredRoles = roles.filter((role) => role.name.includes(value));

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
                        className={styles.searchBar}
                        placeholder='Название роли или имя участника'
                        label='Поиск среди участников или ролей'
                        onChange={handleChange}
                        onReset={handleReset}
                        value={value}
                    />

                    <RolesAndMembersCheckList
                        className={styles.rolesAndMembers}
                        roles={filteredRoles}
                        members={filteredMembers}
                        checkMember={membersActions.add}
                        checkRole={rolesActions.add}
                        getIsMemberChecked={membersActions.has}
                        getIsRoleChecked={rolesActions.has}
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