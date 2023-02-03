import { FC, useContext } from 'react';
import { AddMemberToRoleModal, Button, ChannelSettingsModalFormValues, Conditional, Icon, OverlayContextProvider, SearchBar, TabContext, TabPanel, UserAvatar } from '@components';
import { RoleContentTabs } from '../..';
import { useSearch } from '@hooks';
import { FormikContextType, useFormikContext } from 'formik';



const styles = {
    wrapper: 'flex flex-col flex-1',
    searchBarWrapper: 'flex gap-4 mb-7',
    searchBar: 'h-8',
    membersNotFound: 'flex flex-col items-center text-sm text-color-muted font-bold',
    listWrapper: 'flex-1 overflow-y-scroll scrollbar-primary',
    list: 'flex flex-col gap-1 h-fit pb-[60px] pr-1',
    item: 'flex gap-2 p-2 rounded hover:bg-primary-hover focus-within:bg-primary-hover group',
    avatar: 'w-6 h-6',
    username: 'truncate text-color-primary text-sm font-semibold',
    removeButton: `shrink-0 w-6 h-6 p-1 ml-auto fill-icon-100 opacity-0 
    group-focus-within:opacity-100 group-hover:opacity-100`,
    removeButtonIcon: 'h-full w-full',
};

export const RoleMembersTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<RoleContentTabs>;
    const { searchValue, handleChange, handleReset } = useSearch();
    const { values, setFieldValue } = useFormikContext() as FormikContextType<ChannelSettingsModalFormValues>;

    const members = Array(29).fill('').map((_, index) => ({
        id: index.toString(),
        name: `member ${index}`,
        avatar: `https://i.pravatar.cc/${50 + index}`,
    }));

    const membersToFilter = members.filter((anyMember) => {
        return values.roleMembers.includes(anyMember.id);
    });

    const filtredMembers = !searchValue ? membersToFilter : membersToFilter.filter((member) => {
        return member.name.includes(searchValue);
    });

    const addMember = (memberIdToAdd: string) => {
        if (values.roleMembers.includes(memberIdToAdd)) return;

        const newValue = [...values.roleMembers, memberIdToAdd];

        setFieldValue('roleMembers', newValue);
    };

    const removeMember = (memberIdToRemove: string) => {
        const newValue = values.roleMembers.filter((memberId) => {
            return memberId !== memberIdToRemove;
        });

        setFieldValue('roleMembers', newValue);
    };

    return (
        <TabPanel 
            className={styles.wrapper}
            {...tabPanelProps.members}
        >
            <div className={styles.searchBarWrapper}>
                <SearchBar
                    className={styles.searchBar}
                    value={searchValue}
                    label='Поиск участников'
                    placeholder='Поиск участников'
                    onChange={handleChange}
                    onReset={handleReset}
                />
                <OverlayContextProvider>
                    {({ isOverlayExist, openOverlay }) => (
                        <>
                            <Button
                                stylingPreset='brand'
                                size='small'
                                hasPopup='dialog'
                                isActive={isOverlayExist}
                                onLeftClick={openOverlay}
                            >
                                <>Добавить участников</>
                            </Button>

                            <AddMemberToRoleModal 
                                roleId={values.roleId}
                                onMemberAdd={addMember}
                            />
                        </>
                    )}
                </OverlayContextProvider>
            </div>

            <Conditional isRendered={!filtredMembers.length}>
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

                                <AddMemberToRoleModal 
                                    roleId={values.roleId}
                                    onMemberAdd={addMember}
                                />
                            </>
                        )}
                    </OverlayContextProvider>
                </div>
            </Conditional>

            <Conditional isRendered={!!filtredMembers.length}>
                <div className={styles.listWrapper}>
                    <ul className={styles.list}>
                        {filtredMembers.map((member) => {
                            const handleRemoveMember = () => removeMember(member.id);

                            return (
                                <li 
                                    className={styles.item}
                                    key={member.id}
                                >
                                    <UserAvatar
                                        className={styles.avatar}
                                        avatar={member.avatar}
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
                                        <Icon
                                            className={styles.removeButtonIcon}
                                            iconId='cross-icon'
                                        />
                                    </Button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </Conditional>
        </TabPanel>
    );
};