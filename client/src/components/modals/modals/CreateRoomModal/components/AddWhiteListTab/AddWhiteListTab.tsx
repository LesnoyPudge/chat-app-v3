import { FC, useContext, useEffect } from 'react';
import { Button, CreateRoomFormValues, CreateRoomModalTabs, SearchBar, TabContext, RolesAndMembersCheckList, LoadedEntityContext } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../../components';
import { useFormikContext } from 'formik';
import { useEntitySubscription, useSet, useTextInput } from '@hooks';
import { SliceEntityState } from '@types';
import { SUBSCRIBABLE_ENTITIES } from '@shared';



const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-3',
    searchBar: 'h-10',
    scrollLimiter: 'min-h-[300px] max-h-[300px]',
};

export const AddWhiteListTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateRoomModalTabs>>(TabContext);
    const { values, isSubmitting, setFieldValue } = useFormikContext<CreateRoomFormValues>();
    const { value, handleChange, handleReset } = useTextInput();
    const [checkedRoleIds, roleHelpers] = useSet<string>(values.whiteList.roles);
    const [checkedMemberIds, memberHelpers] = useSet<string>(values.whiteList.users);
    const [channel] = useContext(LoadedEntityContext.Channel);
    const roles = useEntitySubscription<SliceEntityState.Role>(SUBSCRIBABLE_ENTITIES.ROLE, channel.roles);
    const members = useEntitySubscription<SliceEntityState.User>(SUBSCRIBABLE_ENTITIES.USER, channel.members);

    useEffect(() => {
        const newWhiteList: CreateRoomFormValues['whiteList'] = {
            roles: Array.from(checkedRoleIds),
            users: Array.from(checkedMemberIds),
        };

        setFieldValue('whiteList', newWhiteList);
    }, [checkedRoleIds, checkedMemberIds, setFieldValue]);

    const filteredRoles = roles.filter((role) => role.name.includes(value));
    const filteredMembers = members.filter((member) => member.username.includes(value));

    const isAnyChecked = !!checkedRoleIds.size || !!checkedMemberIds.size;
    const submitButtonText = isAnyChecked ? 'Создать комнату' : 'Пропустить';

    return (
        <>
            <ModalHeader>
                <ModalTitle className={styles.title}>
                    <>Добавить участников или роли</>
                </ModalTitle>
            </ModalHeader>

            <ModalContent className={styles.content}>
                <SearchBar
                    className={styles.searchBar}
                    placeholder='Название роли или имя пользователя'
                    label='Название роли или имя пользователя'
                    value={value}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <RolesAndMembersCheckList
                    className={styles.scrollLimiter}
                    members={filteredMembers}
                    roles={filteredRoles}
                    checkMember={memberHelpers.toggle}
                    checkRole={roleHelpers.toggle}
                    getIsMemberChecked={memberHelpers.has}
                    getIsRoleChecked={roleHelpers.has}
                />
            </ModalContent>

            <ModalFooter>
                <Button
                    stylingPreset='lite'
                    size='medium'
                    onLeftClick={changeTab.createRoomTab}
                >
                    <>Назад</>
                </Button>

                <Button
                    stylingPreset='brand'
                    size='medium'
                    type='submit'
                    isLoading={isSubmitting}
                >
                    {submitButtonText}
                </Button>
            </ModalFooter>
        </>
    );
};