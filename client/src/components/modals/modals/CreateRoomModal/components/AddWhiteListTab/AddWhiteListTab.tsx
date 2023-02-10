import { FC, useContext } from 'react';
import { Button, Conditional, CreateRoomFormValues, CreateRoomModalTabs, Icon, Scrollable, SearchBar, TabContext, UserAvatar, Image } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../../components';
import { conditional, twClassNames } from '@utils';
import { IRole, IUserPreview } from '@backendTypes';
import { FormikContextType, useFormikContext } from 'formik';
import { Heading } from '@libs';
import { useSearch } from '@hooks';
import notFoundImage from '@assets/not-found-image.svg';



const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-3',
    searchBar: 'h-8',
    scrollLimiter: 'h-[300px]',
    notFoundWrapper: 'flex flex-col h-full justify-center items-center',
    notFoundImage: 'w-[85px] h-[85px] mb-4',
    notFoundText: 'text-sm text-color-secondary',
    scrollInner: 'flex flex-col gap-2',
    listTitle: 'text-xs uppercase font-bold',
    list: 'flex flex-col gap-1',
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

    const showRoles = !!filteredRoles.length;
    const showMembers = !!filteredMembers.length;

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
                    value={searchValue}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <div className={styles.scrollLimiter}>
                    <Conditional isRendered={showRoles || showMembers}>
                        <Scrollable>
                            <div className={styles.scrollInner}>
                                <Heading className={styles.listTitle}>
                                    <>Роли</>
                                </Heading>

                                <Conditional isRendered={showRoles}>
                                    <div className={styles.list}>
                                        {filteredRoles.map((role) => {
                                            const handleRoleCheck = () => handleCheck('allowedRoles', role);
                                            const isRoleChecked = isChecked('allowedRoles', role);

                                            return (
                                                <div key={role.id}>
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Conditional>

                                <Conditional isRendered={!showRoles}>
                                    <div className={styles.itemNotFound}>
                                        <>Роли не найдены</>
                                    </div>
                                </Conditional>                                        

                                <Heading className={styles.listTitle}>
                                    <>Участники</>
                                </Heading>

                                <Conditional isRendered={showMembers}>
                                    <div className={styles.list}>
                                        {filteredMembers.map((member) => {
                                            const handleRoleCheck = () => handleCheck('allowedUsers', member);
                                            const isRoleChecked = isChecked('allowedUsers', member);

                                            return (
                                                <div key={member.id}>
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
                                                </div>
                                            );
                                        })}
                                    </div>
                                </Conditional>

                                <Conditional isRendered={!showMembers}>
                                    <div className={styles.itemNotFound}>
                                        <>Участники не найдены</>
                                    </div>
                                </Conditional> 
                            </div>
                        </Scrollable>
                    </Conditional>

                    <Conditional isRendered={!showRoles && !showMembers}>
                        <div className={styles.notFoundWrapper}>
                            <Image
                                className={styles.notFoundImage}
                                src={notFoundImage}
                            />

                            <div className={styles.notFoundText}>
                                <>Роли и участники не найдены</>
                            </div>
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