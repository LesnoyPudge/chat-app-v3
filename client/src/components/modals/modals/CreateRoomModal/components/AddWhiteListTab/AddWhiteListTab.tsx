import { FC, useContext } from 'react';
import { Button, Conditional, CreateRoomFormValues, CreateRoomModalTabs, Icon, Scrollable, SearchBar, TabContext, UserAvatar, Image , CheckBoxIndicatorCheck } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../../components';
import { conditional, twClassNames } from '@utils';
import { IRole, IUserPreview } from '@backendTypes';
import { FormikContextType, useFormikContext } from 'formik';
import { Heading } from '@libs';
import { useTextInput } from '@hooks';
import notFoundImage from '@assets/not-found-image.svg';




const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-3',
    searchBar: 'h-8',
    scroll: 'h-full',
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
    checkBoxIndicator: 'mr-4',
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
    const { value, handleChange, handleReset } = useTextInput();

    const isAnyChecked = !!values.allowedRoles.size || !!values.allowedUsers.size;
    const submitButtonText = conditional('Создать комнату', 'Пропустить', isAnyChecked);

    const handleCheck = (field: 'allowedRoles' | 'allowedUsers', roleOrUserId: string) => {
        const newValue = new Set(values[field]);
        
        if (isChecked(field, roleOrUserId)) {
            newValue.delete(roleOrUserId);
        } else {
            newValue.add(roleOrUserId);
        }

        setFieldValue(field, newValue);
    };

    const isChecked = (field: 'allowedRoles' | 'allowedUsers', roleOrUserId: string) => {
        return !!values[field].has(roleOrUserId);
    };

    const filteredRoles = roles.filter((role) => role.name.includes(value));
    const filteredMembers = members.filter((member) => member.username.includes(value));

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
                    value={value}
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <div className={styles.scrollLimiter}>
                    <Conditional isRendered={showRoles || showMembers}>
                        <Scrollable className={styles.scroll}>
                            <div className={styles.scrollInner}>
                                <Heading className={styles.listTitle}>
                                    <>Роли</>
                                </Heading>

                                <Conditional isRendered={showRoles}>
                                    <div className={styles.list}>
                                        {filteredRoles.map((role) => {
                                            const handleRoleCheck = () => handleCheck('allowedRoles', role.id);
                                            const isRoleChecked = isChecked('allowedRoles', role.id);

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
                                                        <CheckBoxIndicatorCheck
                                                            className={styles.checkBoxIndicator}
                                                            checked={isRoleChecked}
                                                        />

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
                                            const handleRoleCheck = () => handleCheck('allowedUsers', member.id);
                                            const isRoleChecked = isChecked('allowedUsers', member.id);

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
                                                        <CheckBoxIndicatorCheck
                                                            className={styles.checkBoxIndicator}
                                                            checked={isRoleChecked}
                                                        />

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