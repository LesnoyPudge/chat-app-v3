import { FC, useContext } from 'react';
import { Button, CreateRoomFormValues, CreateRoomModalTabs, SearchBar, TabContext, RolesAndMembersCheckList } from '@components';
import { ModalContent, ModalFooter, ModalHeader, ModalTitle } from '../../../../components';
import { conditional } from '@utils';
import { IRole, IUserPreview } from '@backendTypes';
import { useFormikContext } from 'formik';
import { useTextInput } from '@hooks';




const styles = {
    title: 'text-heading-l self-start font-medium',
    content: 'gap-3',
    searchBar: 'h-10',
    scrollLimiter: 'min-h-[300px] max-h-[300px]',
};

const roles = Array(15).fill('').map((_, index) => ({
    id: `roleid ${index}`,
    name: `role ${index}`,
    color: 'red',
    image: '',
} as IRole));

const members = Array(15).fill('').map((_, index) => ({
    id: `userid ${index}`,
    avatar: `https://i.pravatar.cc/5${Math.min(9, index)}`,
    username: `member ${index}`,
} as IUserPreview));

export const AddWhiteListTab: FC = () => {
    const { changeTab } = useContext<TabContext<CreateRoomModalTabs>>(TabContext);
    const { values, setFieldValue } = useFormikContext<CreateRoomFormValues>();
    const { value, handleChange, handleReset } = useTextInput();

    const isAnyChecked = !!values.allowedRoles.size || !!values.allowedMembers.size;
    const submitButtonText = conditional('Создать комнату', 'Пропустить', isAnyChecked);

    const handleCheck = (field: 'allowedRoles' | 'allowedMembers', roleOrUserId: string) => {
        const newValue = new Set(values[field]);

        if (isChecked(field, roleOrUserId)) {
            newValue.delete(roleOrUserId);
        } else {
            newValue.add(roleOrUserId);
        }

        setFieldValue(field, newValue);
    };

    const isChecked = (field: 'allowedRoles' | 'allowedMembers', roleOrUserId: string) => {
        return !!values[field].has(roleOrUserId);
    };

    const filteredRoles = roles.filter((role) => role.name.includes(value));
    const filteredMembers = members.filter((member) => member.username.includes(value));

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
                    checkMember={(id) => handleCheck('allowedMembers', id)}
                    checkRole={(id) => handleCheck('allowedRoles', id)}
                    getIsMemberChecked={(id) => isChecked('allowedMembers', id)}
                    getIsRoleChecked={(id) => isChecked('allowedRoles', id)}
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
                >
                    {submitButtonText}
                </Button>
            </ModalFooter>
        </>
    );
};