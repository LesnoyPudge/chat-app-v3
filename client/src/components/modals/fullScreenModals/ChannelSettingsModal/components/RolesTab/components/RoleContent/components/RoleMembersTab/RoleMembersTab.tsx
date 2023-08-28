import { FC, useContext } from 'react';
import { AddMemberToRoleModal, Button, ChannelSettingsModalFormValues,SpriteImage, OverlayContextProvider, TabContext, TabPanel, UserAvatar } from '@components';
import { RoleContentTabs } from '../..';
import { useFormikContext } from 'formik';



interface RoleMembersTab {
    value: string;
}

const styles = {
    wrapper: 'flex flex-col flex-1',
    membersNotFound: 'flex flex-col items-center text-sm text-color-muted font-bold',
    list: 'flex flex-col gap-1 h-fit pb-[60px] pr-1',
    item: 'flex gap-2 p-2 rounded hover:bg-primary-hover focus-within:bg-primary-hover group',
    avatar: 'w-6 h-6',
    username: 'truncate text-color-primary text-sm font-semibold',
    removeButton: `shrink-0 w-5 h-5 p-1 ml-auto bg-icon-200 fill-primary-300 rounded-full opacity-0 
    group-focus-within:opacity-100 group-hover:opacity-100`,
    removeButtonIcon: 'h-full w-full',
};

export const RoleMembersTab: FC<RoleMembersTab> = ({
    value,
}) => {
    const { tabPanelProps } = useContext<TabContext<RoleContentTabs>>(TabContext);
    const { values } = useFormikContext<ChannelSettingsModalFormValues>();

    const members = Array(29).fill('').map((_, index) => ({
        id: index.toString(),
        name: `member ${index}`,
        avatar: `https://i.pravatar.cc/${50}`,
    }));

    const membersToFilter = members.filter((anyMember) => {
        return values.roleMembers.includes(anyMember.id);
    });

    const filteredMembers = !value ? membersToFilter : membersToFilter.filter((member) => {
        return member.name.includes(value);
    });

    const removeMember = (memberIdToRemove: string) => console.log('remove role', memberIdToRemove);

    return (
        <TabPanel
            className={styles.wrapper}
            {...tabPanelProps.members}
        >
            <If condition={!filteredMembers.length}>
                <div className={styles.membersNotFound}>
                    <div>Участники не найдены.</div>

                    <OverlayContextProvider>
                        {({ isOverlayExist, openOverlay }) => (
                            <>
                                <Button
                                    stylingPreset='link'
                                    size='small'
                                    hasPopup='dialog'
                                    isActive={isOverlayExist}
                                    onLeftClick={openOverlay}
                                >
                                    <>Назначьте участников на эту роль.</>
                                </Button>

                                <AddMemberToRoleModal roleId={values.roleId}/>
                            </>
                        )}
                    </OverlayContextProvider>
                </div>
            </If>

            <If condition={!!filteredMembers.length}>
                <ul className={styles.list}>
                    {filteredMembers.map((member) => {
                        const handleRemoveMember = () => removeMember(member.id);

                        return (
                            <li
                                className={styles.item}
                                key={member.id}
                            >
                                <UserAvatar
                                    className={styles.avatar}
                                    avatarId={member.avatar}
                                    username={member.name}
                                />

                                <div className={styles.username}>
                                    {member.name}
                                </div>

                                <Button
                                    className={styles.removeButton}
                                    label={`Удалить пользователя ${member.name} из списка`}
                                    onLeftClick={handleRemoveMember}
                                >
                                    <SpriteImage
                                        className={styles.removeButtonIcon}
                                        name='CROSS_ICON'
                                    />
                                </Button>
                            </li>
                        );
                    })}
                </ul>
            </If>
        </TabPanel>
    );
};