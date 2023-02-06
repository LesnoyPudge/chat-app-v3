import { FC, useContext } from 'react';
import { Button, Conditional, CreateRoomFormValues, CreateRoomModalTabs, Icon, SearchBar, TabContext, UserAvatar } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../../components';
import { conditional, twClassNames } from '@utils';
import { IRole, IUserPreview } from '@backendTypes';
import { FormikContextType, useFormikContext } from 'formik';
import { Heading } from '@libs';
import { useSearch } from '@hooks';



const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-3',
    contentBlock: 'flex flex-col h-[150px]',
    listTitle: 'text-xs uppercase font-bold mb-2',
    list: 'flex flex-col gap-1 h-full overflow-y-scroll scrollbar-primary',
    listItem: {
        base: `flex w-full items-center py-2 px-1.5 rounded 
        hover:bg-primary-hover focus-visible:bg-primary-hover`,
        active: 'bg-primary-selected',
    },
    checkBox: {
        base: 'mr-4 w-5 h-5 rounded border-2 border-brand',
        active: 'bg-brand',
    },
    checkBoxIcon: {
        base: 'w-full h-full fill-white',
        active: 'hidden',
    },
    itemImage: 'w-5 h-5',
    itemName: 'ml-2 text-sm font-medium truncate',
    itemNotFound: 'flex justify-center items-center h-full font-medium text-sm',
};

const roles = Array(15).fill('').map((_, index) => ({
    id: `roleid ${index}`,
    name: `role ${index}`,
    color: 'red',
    image: '',
} as IRole));

const members = Array(15).fill('').map((_, index) => ({
    id: `userid ${index}`,
    avatar: `https://i.pravatar.cc/5${Math.max(9, index)}`,
    username: `member ${index}`,
} as IUserPreview));

export const AddWhiteListTab: FC = () => {
    const { changeTab } = useContext(TabContext) as TabContext<CreateRoomModalTabs>;
    const { values, setFieldValue } = useFormikContext() as FormikContextType<CreateRoomFormValues>;
    const { searchValue, handleChange, handleReset } = useSearch();

    const isAnyChecked = !!values.allowedRoles.length || !!values.allowedUsers.length;
    const submitButtonText = conditional('Создать комнату', 'Пропустить', isAnyChecked);

    const handleCheck = (field: 'allowedRoles' | 'allowedUsers', roleOrUser: IRole | IUserPreview) => {
        if (!isChecked(field, roleOrUser)) return setFieldValue(field, [...values[field], roleOrUser]);
        
        if (field === 'allowedRoles') {
            const filteredRoles = values.allowedRoles.filter((role) => role.id !== roleOrUser.id);
            setFieldValue(field, filteredRoles);
        } else {
            const filteredUsers = values.allowedUsers.filter((user) => user.id !== roleOrUser.id);
            setFieldValue(field, filteredUsers);
        }
    };

    const isChecked = (field: 'allowedRoles' | 'allowedUsers', roleOrUser: IRole | IUserPreview) => {
        if (field === 'allowedRoles') {
            return !!values.allowedRoles.find((role) => role.id === roleOrUser.id);
        } else {
            return !!values.allowedUsers.find((user) => user.id === roleOrUser.id);
        }
    };

    const filteredRoles = roles.filter((role) => role.name.includes(searchValue));
    const filteredMembers = members.filter((member) => member.username.includes(searchValue));

    return (
        <>
            <ModalHeader>
                <ModalTitle className={styles.title}>
                    <>Добавить участников или роли</>
                </ModalTitle>
            </ModalHeader>

            <ModalContent className={styles.content}>
                <SearchBar
                    className='h-8'
                    placeholder='Название роли или имя пользователя'
                    label='Название роли или имя пользователя'
                    value={searchValue}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <div className={styles.contentBlock}>
                    <Heading className={styles.listTitle}>
                        <>Роли</>
                    </Heading>

                    <Conditional isRendered={!!filteredRoles.length}>
                        <ul className={styles.list}>
                            {roles.map((role) => {
                                const handleRoleCheck = () => handleCheck('allowedRoles', role);
                                const isRoleChecked = isChecked('allowedRoles', role);

                                return (
                                    <li key={role.id}>
                                        <Button
                                            className={twClassNames(
                                                styles.listItem.base,
                                                { [styles.listItem.active]: isRoleChecked },
                                            )}
                                            label={`Добавить роль ${role.name}`}
                                            isActive={isRoleChecked}
                                            onLeftClick={handleRoleCheck}
                                        >
                                            <div className={twClassNames(
                                                styles.checkBox.base,
                                                { [styles.checkBox.active]: isRoleChecked },
                                            )}>
                                                <Icon
                                                    className={twClassNames(
                                                        styles.checkBoxIcon.base,
                                                        { [styles.checkBoxIcon.active]: !isRoleChecked },
                                                    )}
                                                    iconId='check-icon'
                                                />
                                            </div>

                                            <Icon
                                                className={styles.itemImage}
                                                style={{ fill: role.color }}
                                                iconId='role-shield-icon'
                                            />

                                            <div className={styles.itemName}>
                                                {role.name}
                                            </div>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Conditional>

                    <Conditional isRendered={!roles.length}>
                        <div className={styles.itemNotFound}>
                            <>Вы ещё не создали ни одной роли</>
                        </div>
                    </Conditional>

                    <Conditional isRendered={!!roles.length && !filteredRoles.length}>
                        <div className={styles.itemNotFound}>
                            <>Роли не найдены</>
                        </div>
                    </Conditional>
                </div>

                <div className={styles.contentBlock}>
                    <Heading className={styles.listTitle}>
                        <>Участники</>
                    </Heading>

                    <Conditional isRendered={!!filteredMembers.length}>
                        <ul className={styles.list}>
                            {filteredMembers.map((member) => {
                                const handleRoleCheck = () => handleCheck('allowedUsers', member);
                                const isRoleChecked = isChecked('allowedUsers', member);

                                return (
                                    <li key={member.id}>
                                        <Button
                                            className={twClassNames(
                                                styles.listItem.base,
                                                { [styles.listItem.active]: isRoleChecked },
                                            )}
                                            label={`Добавить участника ${member.username}`}
                                            isActive={isRoleChecked}
                                            onLeftClick={handleRoleCheck}
                                        >
                                            <div className={twClassNames(
                                                styles.checkBox.base,
                                                { [styles.checkBox.active]: isRoleChecked },
                                            )}>
                                                <Icon
                                                    className={twClassNames(
                                                        styles.checkBoxIcon.base,
                                                        { [styles.checkBoxIcon.active]: !isRoleChecked },
                                                    )}
                                                    iconId='check-icon'
                                                />
                                            </div>

                                            <UserAvatar
                                                className={styles.itemImage}
                                                avatar={member.avatar}
                                                username={member.username}
                                            />

                                            <div className={styles.itemName}>
                                                {member.username}
                                            </div>
                                        </Button>
                                    </li>
                                );
                            })}
                        </ul>
                    </Conditional>

                    <Conditional isRendered={!members.length}>
                        <div className={styles.itemNotFound}>
                            <>Вы ещё никого не пригласили</>
                        </div>
                    </Conditional>

                    <Conditional isRendered={!!members.length && !filteredMembers.length}>
                        <div className={styles.itemNotFound}>
                            <>Участники не найдены</>
                        </div>
                    </Conditional>
                </div>
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
                >
                    {submitButtonText}
                </Button>
            </ModalFooter>
        </>
    );
};