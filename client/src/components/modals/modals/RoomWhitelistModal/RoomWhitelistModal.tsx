import { FC, useContext } from 'react';
import { Button, LoadedEntityContext, ModalWindow, OverlayContext, RolesAndMembersCheckList, SearchBar } from '@components';
import { ModalContainer, ModalContent, ModalFooter, ModalHeader, ModalSubtitle, ModalTitle } from '../../components';
import { useTextInput, useEntitySubscription } from '@hooks';
import { SliceEntityState } from '@types';
import { SUBSCRIBABLE_ENTITIES } from '@shared';



type RoomWhitelistModal = {
    handleChange: (whiteList: Pick<SliceEntityState.Room, 'whiteList'>['whiteList']) => void;
} & Pick<SliceEntityState.Room, 'whiteList'>

const styles = {
    searchBar: 'h-10 mb-2',
    rolesAndMembers: 'max-h-[300px]',
};

export const RoomWhitelistModal: FC<RoomWhitelistModal> = ({
    whiteList,
    handleChange,
}) => {
    const { closeOverlay } = useContext(OverlayContext);
    const search = useTextInput();
    const [channel] = useContext(LoadedEntityContext.Channel);
    const [room] = useContext(LoadedEntityContext.Room);

    const allRoles = useEntitySubscription<SliceEntityState.Role>(SUBSCRIBABLE_ENTITIES.ROLE, channel.roles);
    const allMembers = useEntitySubscription<SliceEntityState.User>(SUBSCRIBABLE_ENTITIES.USER, channel.members);

    const helpers = {
        members: {
            toggle: (id: string) => {
                handleChange({
                    roles: whiteList.roles,
                    users: (
                        whiteList.users.includes(id)
                            ? whiteList.users.filter((uid) => uid !== id)
                            : [...whiteList.users, id]
                    ),
                });
            },

            has: (id: string) => {
                return whiteList.users.includes(id);
            },
        },

        roles: {
            toggle: (id: string) => {
                handleChange({
                    roles: (
                        whiteList.roles.includes(id)
                            ? whiteList.roles.filter((rid) => rid !== id)
                            : [...whiteList.roles, id]
                    ),
                    users: whiteList.users,
                });
            },

            has: (id: string) => {
                return whiteList.roles.includes(id);
            },
        },
    };

    const filteredRoles = allRoles.filter((role) => role.name.includes(search.value));
    const filteredMembers = allMembers.filter((member) => member.username.includes(search.value));

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
                        {room.name}
                    </ModalSubtitle>
                </ModalHeader>

                <ModalContent>
                    <SearchBar
                        className={styles.searchBar}
                        placeholder='Название роли или имя участника'
                        label='Поиск среди участников или ролей'
                        onChange={search.handleChange}
                        onReset={search.handleReset}
                        value={search.value}
                    />

                    <RolesAndMembersCheckList
                        className={styles.rolesAndMembers}
                        roles={filteredRoles}
                        members={filteredMembers}
                        checkMember={helpers.members.toggle}
                        checkRole={helpers.roles.toggle}
                        getIsMemberChecked={helpers.members.has}
                        getIsRoleChecked={helpers.roles.has}
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
                        onLeftClick={closeOverlay}
                    >
                        <>Готово</>
                    </Button>
                </ModalFooter>
            </ModalContainer>
        </ModalWindow>
    );
};