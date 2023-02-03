import { FC, useContext } from 'react';
import { Image, CheckBoxIndicator, Conditional, SearchBar, Separator, TabContext, TabPanel } from '@components';
import { useSearch } from '@hooks';
import { FormikCheckBox, Heading, HeadingLevel } from '@libs';
import roleNotFoundImage from '@assets/role-not-found-image.svg';
import { RoleContentTabs } from '../..';



const permissionGroups = [
    {
        name: 'Основные права сервера',
        permissions: [
            {
                name: 'roleChannelControl',
                title: 'Управлять каналом',
                description: 'Даёт участникам право менять внешний вид этого канала.',
            },
            {
                name: 'roleRoomControl',
                title: 'Управлять комнатами',
                description: 'Позволяет участникам создавать, редактировать и удалять комнаты.',
            },
        ],
    },
    {
        name: 'Права участников',
        permissions: [
            {
                name: 'roleCreateInvitation',
                title: 'Создание приглашения',
                description: 'Позволяет участникам приглашать на этот сервер новых участников.',
            },
            {
                name: 'roleKickMember',
                title: 'Выгонять участников',
                description: 'Позволяет участникам удалять с этого канала других участников. Выгнанные участники смогут вернуться, только получив новое приглашение.',
            },
            {
                name: 'roleBanMember',
                title: 'Банить участников',
                description: 'Позволяет участникам навсегда банить на этом канале других участников.',
            },
        ],
    },
    {
        name: 'Права текстового канала',
        permissions: [
            {
                name: 'roleSendMessage',
                title: 'Отправлять сообщения',
                description: 'Позволяет участникам отправлять сообщения на текстовых каналах.',
            },
        ],
    },
    {
        name: 'Расширенные права',
        permissions: [
            {
                name: 'roleIsAdministrator',
                title: 'Администратор',
                description: 'Участники с этим правом имеют все права и обходят особые права и ограничения канала (например, эти участники получают доступ ко всем приватным комнатам).',
            },
        ],
    },
];

const styles = {
    wrapper: 'flex flex-col flex-1',
    searchBar: 'mb-8',
    roleNotFoundWrapper: 'flex flex-col items-center gap-4',
    roleNotFoundImage: 'w-[85px] h-[85px]',
    roleNotFoundText: 'text-sm text-color-secondary',
    listWrapper: 'flex-1 overflow-y-scroll scrollbar-primary',
    list: 'h-fit pr-4 pb-[60px]',
    permissionGroupTitle: 'block text-xs text-color-secondary uppercase font-bold mb-5',
    permissionCheckBox: 'flex justify-between gap-2 mb-2',
    permissionTitle: 'text-color-primary font-medium',
    permissionDescription: 'text-color-secondary text-sm',
};

export const RolePermissionsTab: FC = () => {
    const { tabPanelProps } = useContext(TabContext) as TabContext<RoleContentTabs>;
    const { searchValue, handleChange, handleReset } = useSearch();
    
    const filtredPermissionGroups = permissionGroups.filter((group) => {
        return !!group.permissions.filter((permission) => {
            const matchInTitle = permission.title.toLowerCase().includes(searchValue.toLowerCase());
            const matchInDescription = permission.description.toLowerCase().includes(searchValue.toLowerCase());
            return matchInTitle || matchInDescription; 
        }).length;
    });

    const showPermissions = !!filtredPermissionGroups.length;

    return (
        <HeadingLevel>
            <TabPanel
                className={styles.wrapper}
                {...tabPanelProps.permissions}
            >
                <SearchBar
                    className={styles.searchBar}
                    value={searchValue}
                    label='Поиск по правам'
                    placeholder='Поиск по правам'
                    onChange={handleChange}
                    onReset={handleReset}
                />

                <Conditional isRendered={!showPermissions}>
                    <div className={styles.roleNotFoundWrapper}>
                        <Image
                            className={styles.roleNotFoundImage}
                            src={roleNotFoundImage}
                        />

                        <div className={styles.roleNotFoundText}>
                            <>Права не найдены</>
                        </div>
                    </div>
                </Conditional>

                <Conditional isRendered={showPermissions}>
                    <div className={styles.listWrapper}>
                        <div className={styles.list}>
                            {filtredPermissionGroups.map((group, groupIndex) => (
                                <div key={group.name}>
                                    <Heading className={styles.permissionGroupTitle}>
                                        {group.name}
                                    </Heading>
            
                                    {group.permissions.map((premission, premissionIndex) => {
                                        const isLastGroup = groupIndex === permissionGroups.length - 1;
                                        const isLastItem = premissionIndex === group.permissions.length - 1;
                                        const showSeparator = !(isLastGroup && isLastItem);

                                        return (
                                            <div key={premission.name}>
                                                <FormikCheckBox 
                                                    className={styles.permissionCheckBox}
                                                    name={premission.name}
                                                    label={premission.title}
                                                >
                                                    {({ checked }) => (
                                                        <>
                                                            <div className={styles.permissionTitle}>
                                                                {premission.title}
                                                            </div>
        
                                                            <CheckBoxIndicator checked={checked}/>
                                                        </>
                                                    )}
                                                </FormikCheckBox>
        
                                                <div className={styles.permissionDescription}>
                                                    {premission.description}
                                                </div>
                                        
                                                <Conditional isRendered={showSeparator}>
                                                    <Separator spacing={20}/>
                                                </Conditional>
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}
                        </div>
                    </div>
                </Conditional>
            </TabPanel>
        </HeadingLevel>
    );
};